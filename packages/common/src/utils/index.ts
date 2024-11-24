import _ from 'lodash';

export * from './log';



export function getDiff(oldData: any, newData: any) {
    function getIndex(data: any) {
        var index: any = {};
        _.forEach(data, (obj) => (index[obj._id] = obj));
        return index;
    }

    var result: any = {},
        oldIndex = getIndex(oldData),
        newIndex = getIndex(newData);

    _.forEach(oldData, (obj) => {
        if (newIndex[obj._id]) {
            var newObj = newIndex[obj._id];
            var objDiff: any = (result[obj._id] = {});
            for (var key in obj) {
                if (_.isUndefined(newObj[key])) {
                    objDiff[key] = null;
                } else if (typeof obj[key] != typeof newObj[key] || (obj[key] && !newObj[key])) {
                    objDiff[key] = newObj[key];
                } else if (_.isObject(obj[key])) {
                    objDiff[key] = {};

                    for (var subkey in obj[key]) {
                        if (!_.isEqual(obj[key][subkey], newObj[key][subkey])) {
                            objDiff[key][subkey] = newObj[key][subkey];
                        }
                    }
                    for (var subkey in newObj[key]) {
                        if (_.isUndefined(obj[key][subkey])) {
                            objDiff[key][subkey] = newObj[key][subkey];
                        }
                    }
                    if (!_.size(objDiff[key])) {
                        delete result[obj._id][key];
                    }
                } else if (!_.isEqual(obj[key], newObj[key])) {
                    objDiff[key] = newObj[key];
                }
            }
            for (var key in newObj) {
                if (_.isUndefined(obj[key])) {
                    objDiff[key] = newObj[key];
                }
            }
            if (!_.size(objDiff)) {
                delete result[obj._id];
            }
        } else {
            result[obj._id] = null;
        }
    });

    _.forEach(newData, (obj) => {
        if (!oldIndex[obj._id]) {
            result[obj._id] = obj;
        }
    });

    return result;
}
