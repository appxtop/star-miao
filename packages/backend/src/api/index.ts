import { ApiError, ApiErrorCode, ApiResultBase, ApiTypeMap } from "@mono/common";
import { SessionUser } from "../types";
import { checkToken } from "../authlib";
import { auth } from "./auth";
import { register } from "./register";
import { user } from "./user";
import { card } from "./card";
import _ from "lodash";

export type ApiMapType = {
    [path in keyof ApiTypeMap]:
    {
        user: true,
        fn: (
            reqBody: ApiTypeMap[path]['request'],
            user: SessionUser
        ) => Promise<ApiTypeMap[path]['response']>
    } | {
        user?: false,
        fn: (
            reqBody: ApiTypeMap[path]['request']
        ) => Promise<ApiTypeMap[path]['response']>
    }
};

const apiMap: ApiMapType = {
    ...auth,
    ...register,
    ...user,
    ...card
}

export async function execApi(
    opts: {
        path: keyof typeof apiMap,
        body: any,
        token?: string,
        user?: SessionUser
    }) {

    const { path, token, body, user } = opts;

    const routerItem = apiMap[path];
    let result: ApiResultBase;
    if (!routerItem) {
        result = {
            errorCode: ApiErrorCode.ApiNotFound
        }
        return result;
    }
    try {
        let user_: SessionUser;
        if (routerItem.user) {
            user_ = user || await checkToken(token);
        }
        const data = await routerItem.fn(body, user_!);
        result = _.extend({ ok: 1 } as any, data);
    } catch (e: any) {
        if (e instanceof ApiError) {
            result = {
                errorCode: e.errorCode,
                error: e.error
            }
        } else {
            console.log(e);
            result = {
                errorCode: ApiErrorCode.SystemError,
                error: "系统异常"
            }
        }
    }

    return result;
}
