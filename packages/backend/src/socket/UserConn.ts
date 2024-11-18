import { UserModel } from "@mono/common";
import { VisitorConn } from "./VisitorConn";
import { Socket } from "socket.io";
import { RoomEmitKey_user } from ".";

/**
 * 已登录用户连接
 */
export class UserConn extends VisitorConn {
    user: UserModel;
    constructor(conn: Socket, user: UserModel) {
        super(conn);
        this.user = user;
    }
    public async init() {
        super.init();
        this.socket.join(RoomEmitKey_user + this.user._id);
    }
}