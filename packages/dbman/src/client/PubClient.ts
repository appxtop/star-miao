import { BaseRedis } from "./BaseRedis";
export class PubClient extends BaseRedis {
    public async publish(channel: string, data: object | string) {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        await this.redisClient.publish(channel, data);
    }
}
export const pubClient = new PubClient();