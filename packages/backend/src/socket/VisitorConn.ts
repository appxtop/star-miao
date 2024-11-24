import { Socket } from "socket.io";
import _ from "lodash";
import { log, UserModel } from "@mono/common";
import { socketModules } from "./mods";
import { ApiMapType, execApi } from "../api";

/**
 * 访客连接,暂时不能直接升级为已登录用户连接
 */
export class VisitorConn {
    public socket: Socket;
    user: UserModel | null = null;
    private subs = new Set<string>();//用来取消订阅的
    constructor(socket: Socket) {
        this.socket = socket;
        socket.on('request', this._doRequest.bind(this));
        socket.on('subscribe', this._doSubscribe.bind(this));
    }
    public async init() {
        this.socket.emit('user', this.user);
    }
    async _doRequest(data: {
        path: string,
        body: any,
    }, callback: Function) {
        const path = data.path as keyof ApiMapType;
        const body = data.body;
        const result = await execApi({ path, body, user: this.user! });
        callback(result);
    }

    async _doSubscribe(channel: string) {
        this.subs.add(channel);
        for (const module of socketModules) {
            try {
                await module.subscribe(channel, this);
            } catch (e) {
                log('订阅出错', e);
            }
        }
    }

}