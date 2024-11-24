import { client, getGameTime, subClient } from "@mono/dbman";
import { VisitorConn } from "../VisitorConn";
import { ApiError, CardModel, getDiff, KVKeys } from "@mono/common";
import _ from "lodash";
import { SocketModule } from "../../types";


interface SubscribeCardDataType {
    //记录下来没啥意义
    gameTime: number;//gameTime不一定代表objects里面的数据都是这个时间的,可能修改到一半的时候被查出来了,需要数据库锁才能达到(但是不重要)
    cards: {
        [id: string]: CardModel
    }
}

class CardModule implements SocketModule {
    private connectedToUsers: {
        [userId: string]: {
            conn: VisitorConn,
            data: SubscribeCardDataType
        }[]
    } = {};

    init() {
        subClient.on(KVKeys.CARDS_DONE, async () => {
            const userIds = _.shuffle(Object.keys(this.connectedToUsers));
            const gameTime = await getGameTime();
            for (const userId of userIds) {
                const connecteds = this.connectedToUsers[userId];
                if (!connecteds || connecteds.length == 0) {
                    continue;
                }
                const cards_ = await client.collection('cards').find({ user: userId });
                const cards = _.keyBy(cards_, '_id');
                for (const i of connecteds) {
                    const eventResult: SubscribeCardDataType & { oldGameTime: number } = {
                        gameTime,
                        oldGameTime: i.data.gameTime,
                        cards: getDiff(i.data.cards, cards),
                    }
                    i.data.cards = cards;
                    i.data.gameTime = gameTime;
                    const channel = `cards:${userId}`;
                    i.conn.socket.emit(channel, eventResult);
                }
            }
        });
    }


    async subscribe(channel: string, conn: VisitorConn) {
        let m;
        if (m = channel.match(/^cards:([a-zA-Z0-9_-]+)$/)) {
            const userId = m[1];
            const user = await client.collection('users').findOne({
                _id: userId
            });
            if (!user) {
                throw new ApiError('未知用户');
            }

            const gameTime = await getGameTime();
            const _cards = await client.collection('cards').find({ user: userId });
            const cards = _.keyBy(_cards, '_id');
            conn.socket.emit(channel, {
                gameTime,
                cards
            } as SubscribeCardDataType);

            this.connectedToUsers[userId] ??= [];
            this.connectedToUsers[userId].push({
                conn,
                data: {
                    gameTime,
                    cards,
                }
            })
        }
    }
    async unsubscribe(channel: string, conn: VisitorConn) {
        let m;
        if (m = channel.match(/^cards:([a-zA-Z0-9_-]+)$/)) {
            const userId = m[1];
            if (this.connectedToUsers[userId]) {
                _.remove(this.connectedToUsers[userId], i => i.conn === conn);
            }
        }
    }
}


export const cardModule = new CardModule();