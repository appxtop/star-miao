import express from 'express';
import { createServer } from 'http';
import { getConfig } from '@mono/common-node';
import { connectAll } from '@mono/dbman';
import { startSocketServer } from './socket';
import _ from 'lodash';
import { HEADER_TOKEN_KEY } from '@mono/common';
import { ApiMapType, execApi } from './api';


export async function startBackendServer() {
    await connectAll();
    const app = express();
    app.use(express.json({ limit: '50mb' }));

    app.use(async (req, res) => {
        const path = req.path as keyof ApiMapType;
        const token = req.headers[HEADER_TOKEN_KEY] as string;
        const body = req.body;
        const result = await execApi({ path, token, body });
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