import { BaseModel, error } from '@mono/common';
import _ from 'lodash';
import { ObjectId } from 'mongodb';
import { QueryFilter } from './types';
function updateDocument(doc: any, update: any) {
    if (update.$set) {
        _.extend(doc, update.$set);
    }
    if (update.$merge) {
        _.merge(doc, update.$merge);
    }

    if (update.$inc) {
        _.forEach(update.$inc, (val, key) => doc[key] = (doc[key] || 0) + val);
    }
    if (update.$unset) {
        for (var j in update.$unset) {
            delete doc[j];
        }
    }
    if (update.$addToSet) {
        for (let i in update.$addToSet) {
            if (!doc[i]) {
                doc[i] = [];
            }
            if (doc[i].indexOf(update.$addToSet[i]) == -1) {
                doc[i].push(update.$addToSet[i]);
            }
        }
    }
    if (update.$pull) {
        for (let i in update.$pull) {
            if (!doc[i]) {
                continue;
            }
            var idx = doc[i].indexOf(update.$pull[i]);
            if (idx != -1) {
                doc[i].splice(idx, 1);
            }
        }
    }

}
function getRandomString() {
    for (var val = Math.floor(Math.random() * 0x10000).toString(16); val.length < 4; val = '0' + val);
    return val;
}
function genId(obj: any) {
    var id = getRandomString() + Date.now().toString(16).slice(4) + getRandomString();
    if (obj && !obj._id) {
        obj._id = id;
    }
    return id;
}
function dealQuery<T extends BaseModel>(query: QueryFilter<T>) {
    const val = query as any;
    if (typeof val === 'object') {
        if (val._id) {
            if (typeof val._id === 'string' && val._id.length == 24) {
                val._id = new ObjectId(val._id as string);
            }
            else if (_.isObject(val._id)) {
                const id = val._id as any;
                if (id.$in && _.isArray(id.$in)) {
                    const arr = id.$in;
                    for (let i = 0; i < arr.length; i++) {
                        const item = arr[i];
                        if (_.isString(item) && item.length == 24) {
                            arr[i] = new ObjectId(item);
                        }
                    }
                    // console.log('更改了', id.$in);
                } else {
                    error("错误了", id);
                }
            }
        }

        for (var i0 in val) {
            const i = i0 as (keyof typeof val);
            if (_.isEqual(val[i], { $ne: null }) && !val.$and) {
                val.$and = [{ [i]: { $ne: null } }, { [i]: { $ne: undefined } }];
                delete val[i];
            }
            if (_.isEqual(val[i], { $eq: null }) && !val.$or) {
                val.$or = [{ [i]: { $eq: null } }, { [i]: { $eq: undefined } }];
                delete val[i];
            }
            dealQuery(val[i]);
        }
    }

    return val as { [P in keyof T]: P extends '_id' ? ObjectId : T[P] };
}


export {
    updateDocument,
    getRandomString,
    genId,
    dealQuery
}
