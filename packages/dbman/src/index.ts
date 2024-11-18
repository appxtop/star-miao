import { client } from "./client/DBClient";
import { kvClient } from "./client/KVClient";

export async function connectAll() {
    await Promise.all([
        client.connect(),
        kvClient.connect()
    ])
}

export { client, kvClient };