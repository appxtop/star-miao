import { io, Socket } from "socket.io-client";

class MySocketIO {
    private socket: Socket;
    private evts: {
        [evtName: string]: Function[]
    } = {};

    constructor() {
        this.socket = this.newSocket();
    }
    newSocket() {
        if (this.socket) {
            this.socket.disconnect();
        }
        const token = localStorage.getItem('token');
        const socket = this.socket = io({
            path: '/socket',
            reconnection: true,//启用自动重连
            reconnectionAttempts: 100,  // 重连最大次数
            reconnectionDelay: 1000,  // 重连延迟
            auth: {
                token
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

    public addListener(channel: string, listener: (...args: any[]) => void) {
        this.evts[channel] ||= [];
        this.evts[channel].push(listener);
    }
}


export const ws = new MySocketIO();