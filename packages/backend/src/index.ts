import express, { response } from 'express';
import { createServer } from 'http';
import { getConfig } from '@mono/common-node';
import { connectAll } from '@mono/dbman';
import { startSocketServer } from './socket';
import routers from './router';
import _ from 'lodash';
import { checkToken } from './authlib';
import { ShortUser } from './types';
import { HEADER_TOKEN_KEY } from '@mono/common';
export async function startBackendServer() {
    await connectAll();
    const app = express();
    app.use(express.json({ limit: '50mb' }));

    for (const keyStr in routers) {
        const path = keyStr as keyof typeof routers;
        const routerItem = routers[path];
        app.use(path, async (req, res) => {
            let user: ShortUser | undefined = undefined;
            if (routerItem.user) {
                const token = req.headers[HEADER_TOKEN_KEY] as string;
                if (!token) {
                    res.status(401).json({ error: '未认证账号' });
                    return;
                }
                try {
                    user = await checkToken(token);
                } catch (e: any) {
                    response.status(401).json({ error: e.message });
                    return;
                }
            }
            const body = req.body;
            try {
                const data = await routerItem.fn(body, user!);
                if (res.headersSent) {
                    return;
                }
                res.json(_.extend({ ok: 1 }, data));
            } catch (error: any) {
                res.json({ error: '' + error });
                if (error.stack) {
                    console.error(error.stack);
                }
            }
        });
    }

    app.use((req, res) => {
        console.log('未实现的请求:', req.method, req.baseUrl, 'path:', req.path);
        res.status(404).json({ "error": req.method + ',' + req.url + ',not found' });
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