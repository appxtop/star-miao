export interface BaseModel {
    _id: string;
}

export interface UserModel extends BaseModel {
    username: string;
    /**
     * 仅仅在注册防止重复用户名的时候使用
     */
    usernameLower: string;
    passwordHash: string;
    nickname: string;
    email: string;
}

export interface RoomModel extends BaseModel {
    name: string;
}

export type CardType = '猫薄荷' | '猫薄荷田';
export interface CardModel extends BaseModel {
    type: CardType;
    num: number;
    user: string;
    x: number;
    y: number;
}
