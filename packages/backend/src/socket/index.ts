import http from "http";
import { Server } from "socket.io";
import { checkToken } from "../authlib";
import { client } from "@mono/dbman";
import { VisitorConn } from "./VisitorConn";
import { UserConn } from "./UserConn";
import { HEADER_TOKEN_KEY } from "@mono/common";

let socketServer: Server;
export function startSocketServer(server: http.Server) {
    socketServer = new Server(server, {
        path: '/socket'
    });
    socketServer.on('connect', async socket => {
        try {
            const token = socket.handshake.auth[HEADER_TOKEN_KEY] as string;
            const { _id } = await checkToken(token);
            const user = await client.collection('users').findOne({ _id }, { password: false });
            if (!user) {
                throw new Error("错误用户");
            }
            new UserConn(socket, user).init();

        } catch (e) {
            new VisitorConn(socket).init();
        }
    });
}


export async function roomEmit(room: string, name: string, msg: any) {
    if (!socketServer) {
        console.error('socketio没有初始化');
        return;
    }
    socketServer.to(room).emit(name, msg);
}


export const RoomEmitKey_user = 'user:';
