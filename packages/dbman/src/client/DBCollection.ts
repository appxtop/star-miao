import { BaseModel } from "@mono/common";
import { Db, ObjectId } from "mongodb";
import { Projection, QueryFilter, UpdateData } from "../types";
import { dealQuery } from "../dbutils";
import _ from "lodash";

export class DBCollection<T extends BaseModel> {
    private collectionName: string;
    private db: Db;
    constructor(collectionName: string, db: Db) {
        this.collectionName = collectionName;
        this.db = db;
    }
    public get tb() {
        return this.db.collection(this.collectionName);
    }

    async find(query: QueryFilter<T>, projection?: Projection<T>) {
        const filter = dealQuery(query);
        const cursor = this.tb.find(filter, {
            projection
        });
        const data = await cursor.toArray();
        return dataFilter(data) as T[];
    }

    async findOne(query: QueryFilter<T>, projection?: Projection<T>) {
        const filter = dealQuery(query);
        const data = await this.tb.findOne(filter, {
            projection
        });
        return dataFilter(data) as T;
    }


    async exist(query: QueryFilter<T>) {
        const filter = dealQuery(query);
        const data = await this.tb.findOne(filter, {
            projection: {
                _id: true
            }
        });
        if (data) {
            return { _id: data._id.toString() };
        }
        return null;
    }


    async insertOne(data: Partial<Omit<T, '_id'>>) {
        const res = await this.tb.insertOne(data);
        return {
            _id: res.insertedId.toString()
        }
    }

    async insertMany(datas: Partial<Omit<T, '_id'>>[]) {
        const res = await this.tb.insertMany(datas);
        return {
            insertedIds: res.insertedIds,
            insertedCount: res.insertedCount,
            acknowledged: res.acknowledged
        }
    }
    async removeWhere(query: QueryFilter<T>) {
        const filter = dealQuery(query);
        const res = await this.tb.deleteMany(filter);
        return {
            acknowledged: res.acknowledged,
            deletedCount: res.deletedCount
        };
    }
    async updateMany(query: QueryFilter<T>, data: UpdateData<T>, params?: { upsert?: boolean }) {
        return this._update(query, data, false, params);
    }
    async updateOne(query: QueryFilter<T>, data: UpdateData<T>, params?: { upsert?: boolean }) {
        return this._update(query, data, true, params);
    }
    private async _update(query: QueryFilter<T>, data: UpdateData<T>, one: boolean, params?: { upsert?: boolean }) {
        const filter = dealQuery(query);
        if (data.$merge) {
            const flat = (obj: any, stack: string[] = []) => {
                const ret: any = {}
                if (obj != null && typeof obj === 'object' && !Array.isArray(obj)) {
                    Object.entries(obj).forEach(([k, v]) => {
                        if (v !== undefined) {
                            Object.assign(ret, flat(v, [...stack, k]))
                        }
                    })
                }
                else if (stack.length) {
                    if (obj !== undefined) {
                        ret[stack.join('.')] = obj
                    }
                } else {
                    return obj
                }
                return ret
            }
            const merge = flat(data.$merge);
            delete data.$merge;
            data.$set = merge;
        }
        const { modifiedCount } = one ? await this.tb.updateOne(filter, data as any, params) : await this.tb.updateMany(filter, data as any, params);
        return { modified: modifiedCount }
    }

    async bulk(bulks: { op: string, id: string, update: any, data: any }[]) {
        const batch = this.tb.initializeUnorderedBulkOp();
        bulks.forEach(i => {
            if (i.op === 'insert') {
                if (i.data._id && typeof i.data._id === 'string' && i.data._id.length == 24) {
                    i.data._id = new ObjectId(i.data._id as string);
                }
                batch.insert(i.data);
                return;
            }
            const q = { _id: (i.id && i.id.length === 24) ? new ObjectId(i.id + '') : i.id }
            if (i.op === 'update') {
                batch.find(q).update(i.update);
                return;
            }
            if (i.op === 'remove') {
                batch.find(q).deleteOne();
                return;
            }
        });
        const res = await batch.execute();
        return res;
    }

    async findEx(query: QueryFilter<T>, opts: { offset?: number, limit?: number, sort: { [key: string]: 1 | -1 } }) {
        const filter = dealQuery(query);
        const cursor = this.tb.find(filter);
        if (opts.sort) {
            cursor.sort(opts.sort);
        }
        if (opts.offset) {
            cursor.skip(opts.offset);
        }
        if (opts.limit) {
            cursor.limit(opts.limit);
        }
        const data = await cursor.toArray();
        return dataFilter(data) as T[];
    }
    async count(query: QueryFilter<T>) {
        const filter = dealQuery(query);
        const res = await this.tb.countDocuments(filter);
        return res;
    }


}


function dataFilter(data: any) {
    if (data) {
        const arr = _.isArray(data) ? data : [data];
        arr.forEach(item => {
            if (item['_id']) {
                item['_id'] = item['_id'].toString(); //过滤掉new ObjectId();
            }
        })
    }
    return data;
}