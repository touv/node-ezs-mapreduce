/*jshint node:true, laxcomma:true*/
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const cbor = require('cbor');
const os = require('os');
const path = require('path');

function fn(data, feed, operator) {
  let self = this;
  let field = self.getParam('field', '_id');
  if (!Array.isArray(field)) {
    field = [field];
  }

  if (self.isFirst()) {
    self.store = {};
  }
  else if (self.isLast()) {
    let max = Object.keys(self.store).length, cur = 0;
    Object.keys(self.store).forEach((hash) => {
      self.store[hash].filehandle.close();
      self.store[hash].values = [];
      self.store[hash].outstrm = fs.createReadStream(self.store[hash].filepath);
      self.store[hash].decoder = new cbor.Decoder();
      self.store[hash].decoder.on('data', function(obj){
        self.store[hash].values.push(obj);
      });
      self.store[hash].decoder.on('end', function(){
        cur++;
        feed.write({ _id : self.store[hash].key, value : operator.reduce(self.store[hash].key, self.store[hash].values)});
        if (cur === max) {
          feed.close()
        }
      });
      self.store[hash].outstrm.pipe(self.store[hash].decoder)
    })
    return;
  }

  operator.map.call(data, function emit(key, value) {
    let hash = crypto.createHash('sha1').update(JSON.stringify(key)).digest('hex');
    if (! self.store[hash]) {
      self.store[hash] = {};
      self.store[hash].key = key;
      self.store[hash].filepath = path.resolve(os.tmpdir(), hash);
      self.store[hash].filehandle = fs.createWriteStream(self.store[hash].filepath);
    }
    self.store[hash].filehandle.write(cbor.encode(value));
  }, field);

  feed.end();
}

module.exports =  {
  catalog: function(data, feed) {
    fn.call(this, data, feed, require('./lib/catalog.js'));
  },
  count: function(data, feed) {
    fn.call(this, data, feed, require('./lib/catalog.js'));
  },
  distinct: function(data, feed) {
    fn.call(this, data, feed, require('./lib/distinct.js'));
  },
  graph: function(data, feed) {
    fn.call(this, data, feed, require('./lib/graph.js'));
  },
  groupby: function(data, feed) {
    fn.call(this, data, feed, require('./lib/groupby.js'));
  },
  keys: function(data, feed) {
    fn.call(this, data, feed, require('./lib/keys.js'));
  },
  labelize: function(data, feed) {
    fn.call(this, data, feed, require('./lib/labelize.js'));
  },
  max: function(data, feed) {
    fn.call(this, data, feed, require('./lib/max.js'));
  },
  merge: function(data, feed) {
    fn.call(this, data, feed, require('./lib/merge.js'));
  },
  stats: function(data, feed) {
    fn.call(this, data, feed, require('./lib/stats.js'));
  },
  total: function(data, feed) {
    fn.call(this, data, feed, require('./lib/total.js'));
  },
  ventilate: function(data, feed) {
    fn.call(this, data, feed, require('./lib/ventilate.js'));
  },





}
