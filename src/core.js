import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import cbor from 'cbor';
import tmpFilepath from 'tmp-filepath';
import queue from 'async.queue';

const hashing = string => crypto.createHash('sha1').update(JSON.stringify(string)).digest('hex');

const save = store => (task, callback) => {
    const hash = hashing(task.key);
    if (!store[hash]) {
        store[hash] = {};
        store[hash].key = task.key;
        store[hash].filepath = tmpFilepath('.bin');
        store[hash].filehandle = fs.createWriteStream(store[hash].filepath);
    }
    store[hash].filehandle.write(cbor.encode(task.value));
    callback();
};

function core(data, feed, operator) {
    let fields = this.getParam('field', '_id');
    if (!Array.isArray(fields)) {
        fields = [fields];
    }
    if (!this.store) {
        this.store = {};
    }

    if (this.isLast()) {
        const maxi = Object.keys(this.store).length;
        let cur = 0;
        Object.keys(this.store).forEach((hash) => {
            this.store[hash].filehandle.close();
            this.store[hash].values = [];
            this.store[hash].outstrm = fs.createReadStream(this.store[hash].filepath);
            this.store[hash].decoder = new cbor.Decoder();
            this.store[hash].decoder.on('data', (obj) => {
                this.store[hash].values.push(obj);
            });
            this.store[hash].decoder.on('end', () => {
                cur += 1;
                const key = this.store[hash].key;
                let value = operator.reduce(this.store[hash].key, this.store[hash].values);
                if (operator.finalize) {
                    value = operator.finalize(key, value);
                }
                feed.write({
                    _id: key,
                    value,
                });
                fs.unlink(this.store[hash].filepath, () => {
                    if (cur === maxi) {
                        feed.close();
                    }
                });
            });
            this.store[hash].outstrm.pipe(this.store[hash].decoder);
        });
        return;
    }
    const q = queue(save(this.store), os.cpus().length);

    operator.map.call(data, (key, value) => {
        q.push({ key, value });
    }, { fields });

    q.drain = () => feed.end();
}

export default core;
