import { client } from "./client/DBClient";

export async function connectAll() {
    await Promise.all([
        client.connect()
    ])
}

export { client };