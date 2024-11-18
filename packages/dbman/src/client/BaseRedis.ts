import { log } from "@mono/common";
import { getConfig } from "@mono/common-node";
import { createClient, RedisClientType } from "redis";

export class BaseRedis {
    protected redisClient!: RedisClientType;
    private connectPromise?: Promise<void>;

    public async connect() {
        this.connectPromise ||= (async () => {
            const redis_url = getConfig('REDIS_URL');
            log('开始连接redis', redis_url);
            this.redisClient = createClient({ url: redis_url });
            await this.redisClient.connect();
            log("连接redis成功");
        })();
        await this.connectPromise;
    }

    public async destroy() {
        if (this.redisClient) {
            await this.redisClient.disconnect();
        }
    }

}