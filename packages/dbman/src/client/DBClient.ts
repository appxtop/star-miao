import { Db, MongoClient } from "mongodb";
import { getConfig } from '@mono/common-node';
import { log } from '@mono/common';
import { DbModels, DbName } from "../types";
import { DBCollection } from "./DBCollection";

class DBClient {
    private connectPromise?: Promise<void>;
    private db_mongo?: Db;
    private conn_mongo?: MongoClient;
    private collections: Map<DbName, DBCollection<DbModels[DbName]>> = new Map();
    public async connect() {
        this.connectPromise ||= (async () => {
            const mongo_url = getConfig('MONGO_URL')!;
            log('开始连接mongo', mongo_url);
            this.conn_mongo = await MongoClient.connect(mongo_url);
            this.db_mongo = this.conn_mongo.db();
            log('连接mongodb数据库成功');
        })();
        await this.connectPromise;
    }

    public collection<T extends DbName>(name: T): DBCollection<DbModels[T]> {
        if (!this.db_mongo) {
            throw new Error("数据库尚未连接");
        }
        if (!this.collections.has(name)) {
            const newCollection = new DBCollection<DbModels[T]>(name, this.db_mongo);
            this.collections.set(name, newCollection);
        }
        return this.collections.get(name) as DBCollection<DbModels[T]>;
    }


    /**
     * 初始化数据库(创建索引)
     */
    public async initDb() {
        log('初始化数据库(创建索引)');
        if (!this.db_mongo) {
            throw new Error('数据库尚未连接')
        }
        await this.db_mongo.collection('users').createIndex({ usernameLower: 1 }, { unique: true });
        await this.db_mongo.collection('users').createIndex({ email: 1 }, { unique: true });
    }


    public async destroy() {
        if (this.conn_mongo) {
            await this.conn_mongo.close();
        }
    }

}


export const client = new DBClient();

