import { BaseRedis } from "./BaseRedis";

export class KVClient extends BaseRedis {
    public async get(name: string) {
        return await this.redisClient.get(name);
    }
    public async mget(names: string[]) {
        return await this.redisClient.mGet(names);
    }
    public async sadd(name: string, members: string[] | string) {
        return await this.redisClient.sAdd(name, members);
    }
    public async smembers(name: string) {
        return await this.redisClient.sMembers(name);
    }
    public async set(name: string, value: string) {
        return await this.redisClient.set(name, value);
    }
    public async setex(name: string, seconds: number, value: string) {
        return await this.redisClient.setEx(name, seconds, value);
    }
    public async expire(name: string, seconds: number) {
        return await this.redisClient.expire(name, seconds);
    }
    public async ttl(name: string) {
        return await this.redisClient.ttl(name);
    }
    public async del(name: string) {
        return await this.redisClient.del(name);
    }
    public async hmget(name: string, fields: string[]) {
        return await this.redisClient.hmGet(name, fields);
    }
    public async hmset(name: string, data: { [key: string]: string }) {
        return await this.redisClient.hSet(name, data);
    }
    public async hget(name: string, field: string) {
        return await this.redisClient.hGet(name, field);
    }
    public async hset(name: string, field: string, value: string) {
        return await this.redisClient.hSet(name, field, value);
    }
    public async hgetall(name: string) {
        return await this.redisClient.hGetAll(name);
    }
    public async incr(name: string) {
        return await this.redisClient.incr(name);
    }
    public async flushall() {
        return await this.redisClient.flushAll();
    }
}

export const kvClient = new KVClient();