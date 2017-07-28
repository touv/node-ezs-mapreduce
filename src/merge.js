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
    fields
        .filter(function (key) {
            return (dta[key] || doc[key]);
        })
        .map(function (key) {
            return dta[key] || doc[key];
        })
        .forEach(function (field) {
            if (field instanceof Array) {
                field.forEach(function (fld) {
                    emit(fld, dta);
                });
            } else {
                emit(field, dta);
            }
        });
};

module.exports.reduce = function (key, values) {
    var target = {};
    var length = values.length;
    var name;
    var i = 1;

    for (; i < length; ++i) {
        if (values[i]) {
            for (name in values[i]) {
                if (target === values[i][name]) {
                    continue;
                }
                if (values[i][name] !== undefined) {
                    target[name] = values[i][name];
                }
            }
        }
    }
    return target;
};
/* eslint-enable func-names */
/* eslint-enable no-var */
/* eslint-enable prefer-arrow-callback */
/* eslint-enable vars-on-top */
/* eslint-disable */
