import { client } from "./client/DBClient";
import { kvClient } from "./client/KVClient";
import { pubClient } from "./client/PubClient";
import { subClient } from "./client/SubClient";

export async function connectAll() {
    await Promise.all([
        client.connect(),
        kvClient.connect(),
        subClient.connect(),
        pubClient.connect()
    ])
}

export { client, kvClient, subClient, pubClient };

export * from './utils'