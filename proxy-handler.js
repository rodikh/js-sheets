/**
 * Created by rodik on 07/03/2017.
 */

function isNumber(n) {
    return (typeof n === 'string' || typeof n === 'number') && !isNaN(parseFloat(n)) && isFinite(n);
}

let handler = {
    get: (target, key) => {
        if (typeof key === 'string' && key[0] === '$') {
            return target[key.substr(1)];
        } else if (isNumber(key) || target.hasOwnProperty(key)) {
            return target[key];
        } else {
            if (typeof target[key] === 'function') {
                return target[key].bind(target);
            }
            return target[key];
        }
    },
    set: (target, key, value) => {
        target[key] = value;

        if (isNumber(key)) {
            console.log('do update indices here', key);
        }
        return true;
    }
};

module.exports = handler