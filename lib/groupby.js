"use strict";

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
    fields.filter(function (key) {
        return dta[key] || doc[key];
    }).map(function (key) {
        return dta[key] || doc[key];
    }).forEach(function (field) {
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
    return { docs: values };
};
/* eslint-enable func-names */
/* eslint-enable no-var */
/* eslint-enable prefer-arrow-callback */
/* eslint-enable vars-on-top */