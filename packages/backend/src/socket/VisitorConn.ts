import { Socket } from "socket.io";
import _ from "lodash";
import { routers } from "../router";
import { ApiMap, UserModel } from "@mono/common";
/**
 * 访客连接,暂时不能直接升级为已登录用户连接
 */
export class VisitorConn {
    protected socket: Socket;
    user: UserModel | null = null;
    constructor(socket: Socket) {
        this.socket = socket;
        socket.on('request', this._doRequest.bind(this));
    }
    public async init() {
        this.socket.emit('user', this.user);
    }
    async _doRequest(data: {
        path: string,
        body: any,
    }, callback: Function) {
        const path = data.path;
        const body = data.body;
        const routerItem = routers[path as keyof ApiMap];
        if (!routerItem) {
            callback({ error: '未知api' });
            return;
        }
        if (routerItem.user && !this.user) {
            callback({ error: "没有权限", status: 401 });
            return false;
        }
        try {
            const res = await routerItem.fn(body, this.user!);
            callback(_.extend({ ok: 1 }, res));
        } catch (e) {
            callback({ error: e.message })
        }
    }
}