/**
 * Created by rodik on 07/03/2017.
 */
const fs = require('fs');

class JSONSheet extends Array {
    /**
     *
     * @param {Array} [arr] Array to create the sheet from. If an integer is passed, a normal Array will be returned.
     * @param options
     * @returns {*}
     */
    constructor(arr = [], options = {}) {
        if (typeof arr === "number" && Object.keys(options).length === 0) {
            return new Array(arr);
        }

        super();
        if (arr && arr.length) {
            Array.prototype.push.apply(this, arr.map(a => Object.assign({}, a)));
        }

        this.options = options;
        this.createindices(options.indices);

        // return new Proxy(this, handler);
    }

    createindices() {
        this.indices = {};
        if (!this.options.indices || !this.options.indices.length) {
            return;
        }

        this.options.indices.forEach(this.createIndex.bind(this));
    }

    createIndex(indexName) {
        let index = this.indices[indexName];
        if (!index) {
            index = this.indices[indexName] = {};
        }
        this.forEach((item) => {
            let itemValues = item[indexName];
            if (itemValues === undefined) {
                return;
            }
            if (!Array.isArray(itemValues)) {
                itemValues = [itemValues];
            }
            itemValues.forEach(itemValue => {
                if (index[itemValue]) {
                    index[itemValue].push(item);
                } else {
                    index[itemValue] = [item];
                }
            });
        });
    }

    addToIndices(item) {
        if (!this.indices) {
            return;
        }

        Object.keys(this.indices).forEach((key) => {
            let keyIndex = this.indices[key];
            if (item.hasOwnProperty(key)) {
                if (keyIndex[item[key]]) {
                    keyIndex[item[key]].push(item);

                } else {
                    keyIndex[item[key]] = [item];
                }
            }
        });
    }

    removeFromIndices(item) {
        if (!this.indices) {
            return;
        }

        Object.keys(this.indices).forEach((key) => {
            let keyIndex = this.indices[key];
            if (item.hasOwnProperty(key)) {
                if (keyIndex[item[key]]) {
                    if (keyIndex[item[key]].length < 2) {
                        delete keyIndex[item[key]];
                    } else {
                        let indexOf = keyIndex[item[key]].indexOf(item);
                        if (indexOf !== -1) {
                            keyIndex[item[key]].splice(indexOf,1);
                        }
                    }
                }
            }
        });
    }

    save(path) {
        if (!path) {
            path = this.path;
        }

        if (!path) {
            return false;
        }

        fs.writeFileSync(path, JSON.stringify(this, null, 4));
        return true;
    }

    static fromFile(path, options) {
        let fArr = new JSONSheet(JSON.parse(fs.readFileSync(path)), options);
        fArr.path = path;
        return fArr;
    }

    sortByField(field, dir) {
        // TODO: add cases for numeric and lexical
        return this.sort((a, b) => {
            if (dir === -1) {
                return parseInt(b[field], 10) - parseInt(a[field], 10);
            } else {
                return parseInt(a[field], 10) - parseInt(b[field], 10);
            }
        });
    }

    findByField(fieldName, value) {
        if (this.indices[fieldName]) {
            return this.indices[fieldName][value] || [];
        }

        console.warn('searching without index');
        return this.filter((item) => {
            return item[fieldName] === value;
        });
    }

// union(fObj, field) {
//     // let union = new Set([...fObj.indices[field], ...this.indices[field]]);
//     // fObj.indices
// }
//
// intersect(fObj, field) {
//     // let a = fObj.indices[field];
//     // this.indices[field];
//     // let intersection = new Set([...a].filter(x => b.has(x)));
// }

    merge(fObj, field, otherField = field, fieldsToCopy, renames) {
        fObj.forEach((extItem) => {
            if (this.indices[field][extItem[otherField]]) {
                if (!fieldsToCopy) {
                    Object.assign(this.indices[field][extItem[otherField]], extItem);
                } else {
                    Object.keys(extItem).filter((key) => fieldsToCopy.indexOf(key) !== -1).forEach((key) => {
                        if (renames && renames[key]) {
                            this.indices[field][extItem[otherField]][renames[key]] = extItem[key];
                        } else {
                            this.indices[field][extItem[otherField]][key] = extItem[key];
                        }
                    });
                }
            }
        });

        return this;
    }

    query(queryObj) {
        let queries = Object.keys(queryObj);
        queries.forEach(key => {
            if (key in queryMethods) {
            }
        });

        // TODO: use indices and fallback to manual
    }
}

['push', 'unshift'].forEach((method) => {    // additive
    JSONSheet.prototype[method] = function () {
        let rt = Array.prototype[method].call(this, ...arguments);
        this.addToIndices(...arguments);
        return rt;
    };
});

['pop', 'shift'].forEach((method) => {       // subtractive
    JSONSheet.prototype[method] = function () {
        let rt = Array.prototype[method].call(this, ...arguments);
        this.removeFromIndices(rt);
        return rt;
    };
});


const queryMethods = {
    "$sum": function (subQuery) {

    },
    "$avg": function (subQuery) {

    }
};

module.exports = JSONSheet;