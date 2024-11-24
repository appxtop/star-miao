import { defineStore } from "pinia";
import pinia from "./pinia";
import { CardModel, CardType, UpdateCardsType } from "@mono/common";
import _ from "lodash";
import { reactive } from "vue";



//应该改名为cardStore
const useGameStore = defineStore('game', {
    state() {
        const state: {
            maxCardIndex: number,
            card: {
                gameTime: number,
                cards: {
                    [_id: string]: CardModel
                },
                cards_type: {
                    [type in CardType]?: CardModel[]
                },
            },
        } = {
            maxCardIndex: 1,
            card: reactive({
                gameTime: 0,
                cards: {},
                cards_type: {},
            }),
        }
        return state;
    },
    actions: {
        updateCard(data: UpdateCardsType) {
            _.merge(this.card, data);
            const cards_type: { [type in CardType]?: CardModel[] } = {}
            for (const id in this.card.cards) {
                const card = this.card.cards[id];
                cards_type[card.type] ??= [];
                cards_type[card.type]?.push(card);
            }
            this.card.cards_type = cards_type;
        }
    }
});

export const gameStore = useGameStore(pinia);