import EventEmitter from "events";
import { BaseRedis } from "./BaseRedis";

class SubClient extends BaseRedis {
    private ee = new EventEmitter();
    //用来防止connect()方法多次调用
    private pSubscribed: boolean = false;
    public async connect() {
        await super.connect();
        if (this.pSubscribed) {
            return;
        }
        this.pSubscribed = true;
        //#TODO 太耗费性能
        await this.redisClient.pSubscribe('*', (msg, channel) => {
            try {
                let data;
                if (msg.startsWith('{')) {
                    data = JSON.parse(msg);
                } else {
                    data = msg;
                }
                this.ee.emit(channel, [channel, data]);
                this.ee.emit('*', [channel, data]);
            } catch (e) {
                console.error("处理数据出错:", e);
            }
        })
    }

    public async subscribe(channel: string, cb: (channel: string, data: any) => void) {
        this.ee.on(channel, ([channel, data]) => {
            cb(channel, data);
        });
    }
    public async on(channel: string, cb: (data: any) => void) {
        this.ee.on(channel, ([channel, data]) => {
            cb(data);
        })
    }
    public async once(channel: string, cb: (data: any) => void) {
        this.ee.once(channel, ([channel, data]) => {
            cb(data);
        })
    }
}

export const subClient = new SubClient();