import { ApiMap } from "@mono/common"
import { ShortUser } from "../types";
import { auth } from "../api/auth";
import { register } from "../api/register";
import { user } from "../api/user";

export type RoutersType = {
    [path in keyof ApiMap]:
    {
        user: true,
        fn: (
            reqBody: ApiMap[path]['request'],
            user: ShortUser
        ) => Promise<ApiMap[path]['response']>
    } | {
        user?: false,
        fn: (
            reqBody: ApiMap[path]['request']
        ) => Promise<ApiMap[path]['response']>
    }
};

const routers: RoutersType = {
    '/api/auth/login': auth["/api/auth/login"],
    '/api/register/submit': register['/api/register/submit'],
    '/api/register/checkEmail': register['/api/register/checkEmail'],
    '/api/register/checkNickname': register['/api/register/checkNickname'],
    '/api/register/checkUsername': register['/api/register/checkUsername'],
    '/api/user/sendVerCode': user['/api/user/sendVerCode'],
    '/api/user/setEmail': user['/api/user/setEmail'],
    '/api/user/setNickname': user['/api/user/setNickname'],
    '/api/user/setPassword': user['/api/user/setPassword']
};

export default routers;