import fs from 'fs';
import crypto from 'crypto';
import cbor from 'cbor';
import os from 'os';
import path from 'path';

function core(data, feed, operator) {
    const self = this;
    let fields = self.getParam('field', '_id');
    if (!Array.isArray(fields)) {
        fields = [fields];
    }

    if (self.isFirst()) {
        self.store = {};
    } else if (self.isLast()) {
        const maxi = Object.keys(self.store).length;
        let cur = 0;
        Object.keys(self.store).forEach((hash) => {
            self.store[hash].filehandle.close();
            self.store[hash].values = [];
            self.store[hash].outstrm = fs.createReadStream(self.store[hash].filepath);
            self.store[hash].decoder = new cbor.Decoder();
            self.store[hash].decoder.on('data', (obj) => {
                self.store[hash].values.push(obj);
            });
            self.store[hash].decoder.on('end', () => {
                cur += 1;
                const key = self.store[hash].key;
                let value = operator.reduce(self.store[hash].key, self.store[hash].values);
                if (operator.finalize) {
                    value = operator.finalize(key, value);
                }
                feed.write({
                    _id: key,
                    value,
                });
                if (cur === maxi) {
                    feed.close();
                }
            });
            self.store[hash].outstrm.pipe(self.store[hash].decoder);
        });
        return;
    }

    const emit = (key, value) => {
        const hash = crypto.createHash('sha1').update(JSON.stringify(key)).digest('hex');
        if (!self.store[hash]) {
            self.store[hash] = {};
            self.store[hash].key = key;
            self.store[hash].filepath = path.resolve(os.tmpdir(), hash);
            self.store[hash].filehandle = fs.createWriteStream(self.store[hash].filepath);
        }
        self.store[hash].filehandle.write(cbor.encode(value));
    };
    operator.map.call(data, emit, { fields });

    feed.end();
}

export default core;
