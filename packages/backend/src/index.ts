import express from 'express';
import { createServer } from 'http';
import { getConfig } from '@mono/common-node';
import { connectAll } from '@mono/dbman';
import { startSocketServer } from './socket';
import { routers } from './router';
import _ from 'lodash';
import { checkToken } from './authlib';
import { ShortUser } from './types';
import { ApiResultBase, HEADER_TOKEN_KEY } from '@mono/common';
export async function startBackendServer() {
    console.log('启动')
    await connectAll();
    const app = express();
    app.use(express.json({ limit: '50mb' }));
    app.use(async (req, res) => {
        const path = req.path as keyof typeof routers;
        const routerItem = routers[path];
        let result: ApiResultBase | undefined;
        if (routerItem) {
            let user: ShortUser | undefined = undefined;
            if (routerItem.user) {
                const token = req.headers[HEADER_TOKEN_KEY] as string;
                try {
                    user = await checkToken(token);
                } catch (error: any) {
                    result = { status: 401, error: error.message };
                    res.json(result);
                    return;
                }
            }
            const body = req.body;
            try {
                const data = await routerItem.fn(body, user!);
                if (res.headersSent) {
                    return;
                }
                result = _.extend({ ok: 1 } as any, data)
            } catch (error: any) {
                result = { error: error.message };
                if (error.stack) {
                    console.error(error.stack);
                }
            }
            res.json(result);
            return;
        }
        console.log('未实现的请求:', req.method, req.baseUrl, 'path:', req.path);
        result = {
            "error": req.method + ',' + req.url + ',not found',
            status: 404
        }
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