import { io, Socket } from "socket.io-client";
import { getToken } from "../db";
import { HEADER_TOKEN_KEY } from "@mono/common";

class MySocketIO {
    private socket: Socket;
    private evts: {
        [evtName: string]: Function[]
    } = {};
    private subs: {
        [channel: string]: number;
    } = {};

    constructor() {
        this.socket = this.newSocket();
    }
    newSocket() {
        if (this.socket) {
            this.socket.disconnect();
        }
        const token = getToken();
        const socket = this.socket = io({
            path: '/socket',
            reconnection: true,//启用自动重连
            reconnectionAttempts: 100,  // 重连最大次数
            reconnectionDelay: 1000,  // 重连延迟
            auth: {
                [HEADER_TOKEN_KEY]: token
            }
        });

        socket.onAny((evtName, ...args) => {
            const fs = this.evts[evtName];
            fs.forEach(f => {
                f.call(this, ...args);
            });
        })

        return socket;
    }
    async request(path: string, body: any): Promise<any> {
        return await new Promise((resolve, reject) => {
            this.socket.emit('request', { path, body }, (data: any, err: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ data });
                }
            });
        });
    }

    subscribe(channel: string) {
        this.socket.emit('subscribe', channel);
        //记录下来,用来重连的时候重新订阅
        this.subs[channel] ??= 0;
        this.subs[channel]++;
    }

    unSubscribe(channel: string) {
        if (this.subs[channel]) {
            this.subs[channel]--;
            if (this.subs[channel] <= 0) {
                delete this.subs[channel];
                this.socket.emit('unsubscribe', channel)
            }
        } else {
            console.warn('多余的订阅', channel);
        }
    }

    public addListener(channel: string, listener: (...args: any[]) => void) {
        this.evts[channel] ||= [];
        this.evts[channel].push(listener);
    }
}


export const ws = new MySocketIO();