/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable prefer-arrow-callback */
module.exports.map = function (emit, scope) {
    var doc = this;
    var fields = scope.fields;
    var dta = doc.versions ? doc.versions[doc.versions.length - 1] : doc;
    dta.uri = doc.uri;

    // below it's like mongodb
    var values;
    if (fields.length === 1) {
        values = dta[fields[0]];
        if (values !== undefined) {
            if (!Array.isArray(values)) {
                values = [values];
            }
            values = values.sort().map(function (value) {
                var o = {};
                o[fields[0]] = value;
                return o;
            });
        }
    } else if (fields.length > 1) {
        values = fields
            .map(function (field) {
                var fieldValues = {};
                fieldValues[field] = dta[field];
                return fieldValues;
            })
            .reduce(function (previous, current) {
                var field = Object.keys(current)[0];
                if (Array.isArray(current[field])) {
                    current[field].sort().forEach(function (value) {
                        var o = {};
                        o[field] = value;
                        previous.push(o);
                    });
                } else {
                    var o = {};
                    o[field] = current[field];
                    previous.push(o);
                }
                return previous;
            }, []);
    }
    values
        .forEach(function (v, i) {
            values.slice(i + 1).forEach(function (w) {
                emit(JSON.stringify([v, w]), 1);
            });
        });
};

module.exports.reduce = function (key, values) {
    return values.reduce(function (p, c) {
        return p + c;
    }, 0);
};
/* eslint-enable func-names */
/* eslint-enable no-var */
/* eslint-enable prefer-arrow-callback */
/* eslint-enable vars-on-top */
