import { KVKeys } from "@mono/common";
import { kvClient } from "../client/KVClient";

export async function getGameTime() {
    const data = await kvClient.get(KVKeys.GAMETIME);
    return parseInt(data || '1');
}