import { CardModel, CardType } from "./types";

export const cards: {
    [type in CardType]: {
        price?: {
            [type in CardType]?: {
                base: number,
                increment: number,
            }
        }
    }
} = {
    '猫薄荷': {
    },
    '猫薄荷田': {
        price: {
            '猫薄荷': {
                base: 10,
                increment: 5
            }
        }
    }
}

export type UpdateCardsType = {
    gameTime: number;
    cards: {
        [_id: string]: Partial<CardModel>
    }
}