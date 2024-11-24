import { UpdateCardsType } from "../card";
import { ApiErrorCode } from "../error";
import { CardModel, CardType } from "./model";

export interface ApiResultBase {
    ok?: 1;
    error?: string;
    errorCode?: ApiErrorCode;
}

export interface ApiTypeMap {
    "/api/register/submit": {
        request: {
            username: string;
            password: string;
            nickname: string;
            email: string;
            verCode: string;
        };
        response: { token: string };
    },
    '/api/register/checkUsername': {
        request: { username: string };
        response: void;
    },
    '/api/register/checkEmail': {
        request: { email: string };
        response: void;
    },
    '/api/register/checkNickname': {
        request: { nickname: string };
        response: void;
    },
    '/api/auth/login': {
        request: { username: string, password: string };
        response: { token: string };
    },
    '/api/user/setPassword': {
        request: { oldPassword: string; newPassword: string; },
        response: void;
    },
    '/api/user/setEmail': {
        request: { email: string; verCode: string },
        response: void;
    },
    '/api/user/setNickname': {
        request: { nickname: string },
        response: void;
    },
    '/api/user/sendVerCode': {
        request: { email: string },
        response: void
    },
    '/api/card/cards': {
        request: {},
        response: {
            gameTime: number;
            cards: {
                [_id: string]: CardModel
            }
        }
    },
    '/api/card/buy': {
        request: { type: CardType, num: number },
        response: UpdateCardsType
    }
}
