import { randomUUID } from 'crypto';
import { SessionUser } from './types';
import { ApiError, ApiErrorCode, KVKeys } from '@mono/common';
import { kvClient } from '@mono/dbman';
import bcrypt from 'bcryptjs';
export async function genToken(userModel: SessionUser) {
    const token = randomUUID();
    const sessionKey = KVKeys.SESSION + token;
    const sessionValue = JSON.stringify(userModel);
    const expSeconds = 60 * 60 * 1;//过期时间一小时
    await kvClient.setex(sessionKey, expSeconds, sessionValue);
    return token;
}
//认证成功返回user,认证失败抛出异常reject
export async function checkToken(token?: string) {
    if (!token) {
        throw new ApiError(ApiErrorCode.Unauthorized, "没有登录");
    }
    try {
        const sessionUserStr = await kvClient.get(KVKeys.SESSION + token);
        if (!sessionUserStr) {
            throw new ApiError(ApiErrorCode.Unauthorized, "登录过期");
        }
        const sessionUser = JSON.parse(sessionUserStr);
        return sessionUser;
    } catch (e) {
        throw new ApiError(ApiErrorCode.Unauthorized, "登录失效");
    }
}

const salt = 'zwyzwyzwy';
export async function hashPwd(password: string) {
    const str = password + salt;
    const hash = await bcrypt.hash(str, 10);
    return hash;
}
export async function comparePwd(password: string, passwordHash: string) {
    const str = password + salt;
    const result = await bcrypt.compare(str, passwordHash);
    return result;
}