import { ApiError, cards, CardType, tsForin, UpdateCardsType } from "@mono/common";
import { SessionUser } from "../types";
import { client, getGameTime } from "@mono/dbman";
import _ from "lodash";
import { ApiMapType } from ".";

export const card: Pick<ApiMapType, '/api/card/cards' | '/api/card/buy'> = {
    "/api/card/cards": {
        user: true,
        fn: async function (_reqBody: {}, user: SessionUser) {
            let list = await client.collection('cards').find({
                user: user._id
            });
            const gameTime = await getGameTime();
            return {
                gameTime,
                cards: _.keyBy(list, '_id')
            }
        }
    },
    "/api/card/buy": {
        user: true,
        fn: async function (reqBody: { type: CardType }, user: SessionUser) {
            let { type } = reqBody;
            const price = cards[type].price;
            if (!price) {
                throw new ApiError("不能购买");
            }
            //检查是否有购买限制
            const curCard = await client.collection('cards').findOne({
                type,
                user: user._id
            });
            if (!curCard) {
                throw new ApiError('没有解锁');
            }
            //检查余额
            await tsForin(price, async (price, type) => {
                if (!price) {
                    return;
                }
                const card = await client.collection('cards').findOne({
                    type,
                    user: user._id
                });
                const allPrice = price.base + curCard.num * price.increment;
                if (card.num < allPrice) {
                    throw new ApiError('余额不足');
                };
            });
            const updateCards: UpdateCardsType['cards'] = {};
            //#TODO 有锁问题
            //减去余额
            await tsForin(price, async (price, type) => {
                if (!price) {
                    return;
                }
                const allPrice = price.base + curCard.num * price.increment
                await client.collection('cards').updateOne({
                    type,
                    user: user._id
                }, {
                    $inc: {
                        num: -allPrice
                    }
                });

                const card = await client.collection('cards').findOne({
                    type,
                    user: user._id
                });
                if (card) {
                    updateCards[card._id] = { num: card.num };
                }
            });
            //增加数量
            await client.collection('cards').updateOne({
                type,
                user: user._id
            }, {
                $inc: {
                    num: 1
                }
            });
            const card = await client.collection('cards').findOne({
                type,
                user: user._id
            });
            updateCards[card._id] = {
                num: card.num,
            };
            const gameTime = await getGameTime();
            return {
                gameTime,
                cards: updateCards
            }
        }
    }
}