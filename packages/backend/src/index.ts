import express from 'express';
import { createServer } from 'http';
import { getConfig } from '@mono/common-node';
import { connectAll } from '@mono/dbman';
import { startSocketServer } from './socket';
import { routers } from './router';
import _ from 'lodash';
import { checkToken } from './authlib';
import { JwtUser } from './types';
import { ApiError, ApiErrorCode, ApiResultBase, HEADER_TOKEN_KEY } from '@mono/common';

export async function dealApi(
    opts: {
        path: keyof typeof routers,
        body: any,
        token?: string,
        user?: JwtUser
    }) {

    const { path, token, body, user } = opts;

    const routerItem = routers[path];
    let result: ApiResultBase;
    if (!routerItem) {
        result = {
            errorCode: ApiErrorCode.ApiNotFound
        }
        return result;
    }
    try {
        let user_: JwtUser;
        if (routerItem.user) {
            user_ = user || await checkToken(token);
        }
        const data = await routerItem.fn(body, user_!);
        result = _.extend({ ok: 1 } as any, data);
    } catch (e: any) {
        if (e instanceof ApiError) {
            result = {
                errorCode: e.errorCode,
                error: e.error
            }
        } else {
            result = {
                errorCode: ApiErrorCode.SystemError,
                error: "系统异常"
            }
        }
    }

    return result;
}


export async function startBackendServer() {
    await connectAll();
    const app = express();
    app.use(express.json({ limit: '50mb' }));

    app.use(async (req, res) => {
        const path = req.path as keyof typeof routers;
        const token = req.headers[HEADER_TOKEN_KEY] as string;
        const body = req.body;
        const result = await dealApi({ path, token, body });
        res.json(result);
    });
    const server = createServer(app);
    const host = getConfig('BACKEND_HOST');
    const port = parseInt(getConfig('BACKEND_PORT')!);
    server.on('listening', () => {
        console.log(`游戏前端页面listening on http://${host}:${port}`);
    });
    startSocketServer(server);
    server.listen(port, host);
}