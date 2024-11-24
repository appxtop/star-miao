import { CardModel, CardType, KVKeys, log } from "@mono/common";
import { client, kvClient, pubClient } from "@mono/dbman";
import _ from "lodash";

export async function startMainServer() {
    console.log('start engine main');

    const loop = async () => {
        const users = await client.collection('users').find({});
        for (const user of users) {
            const cards_ = await client.collection('cards').find({ user: user._id });
            if (cards_.length == 0) {
                log('初始化卡片信息');
                await client.collection('cards').insertMany([
                    {
                        num: 1,
                        type: '猫薄荷',
                        x: 10,
                        y: 10,
                        user: user._id
                    },
                    {
                        num: 2,
                        type: "猫薄荷田",
                        x: 20,
                        y: 20,
                        user: user._id
                    }
                ]);
                continue;
            }
            const cards = _.keyBy(cards_, 'type') as { [type in CardType]: CardModel };
            if (cards['猫薄荷田'] && cards['猫薄荷'] && cards['猫薄荷田'].num > 0) {
                await client.collection("cards").updateOne({
                    _id: cards['猫薄荷']._id,
                }, {
                    $inc: {
                        num: cards['猫薄荷田'].num * 1
                    }
                });
            }
        }
        const gameTime = await kvClient.incr(KVKeys.GAMETIME);
        console.log('gameTime set:', gameTime);
        await pubClient.publish(KVKeys.CARDS_DONE, gameTime.toString());
    }

    const startLoop = async () => {
        loop();
        setTimeout(() => {
            startLoop();
        }, 1000);
    }

    startLoop();
}