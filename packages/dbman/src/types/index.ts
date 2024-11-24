import { CardModel, RoomModel, UserModel } from "@mono/common"

// export type DbName = "users" | "rooms" | 'cards'

export type DbModels = {
    "users": UserModel;
    "rooms": RoomModel;
    "cards": CardModel;
}
export type DbName = keyof DbModels;

type OverrideIdType<T> = {
    [P in keyof T]: P extends '_id' ? string : T[P];
};
export type QueryFilter<T> = {
    [P in keyof T]?: OverrideIdType<T>[P] | Partial<{
        $gt: number;
        $lt: number;
        /**
         * 小于或等于
         */
        $lte: number;
        $ne: T[P] | null;//暂时不知道是什么意思,应该是not的意思吧
        $in: Array<T[P]>;
    }>;
} & Partial<{
    $or: QueryFilter<T>[];
    $and: QueryFilter<T>[];
}
>;

export type Projection<T> = {
    [P in keyof T]?: boolean
};

// 定义 Nullable 类型
type Nullable<T> = {
    [K in keyof T]?: T[K] | null;
};

export type UpdateData<T> = {
    [P in keyof T]?: T[P]
}
    & Partial<{
        $merge: Partial<T>,
        $addToSet: Partial<T>,
        $pull: Partial<T>,
        $set: Nullable<T>,
        $unset: any,
        $inc: any,//暂时不知道有啥用
        $push: any,
        $setOnInsert: any
    }>