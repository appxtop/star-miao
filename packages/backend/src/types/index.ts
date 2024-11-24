import { VisitorConn } from "../socket/VisitorConn";

export interface SessionUser {
    _id: string;
}

export interface SocketModule {
    init?: () => void;
    subscribe: (channel: string, conn: VisitorConn) => Promise<void>;
    unsubscribe: (channel: string, conn: VisitorConn) => Promise<void>;
}