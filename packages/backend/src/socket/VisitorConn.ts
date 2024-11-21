import { Socket } from "socket.io";
import _ from "lodash";
import { ApiMap, UserModel } from "@mono/common";
import { dealApi } from "..";
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
        const path = data.path as keyof ApiMap;
        const body = data.body;
        const result = await dealApi({ path, body, user: this.user! });
        callback(result);
    }
}