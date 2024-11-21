import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JwtUser } from './types';
import { ApiError, ApiErrorCode } from '@mono/common';

const JWT_SECRET = 'zwy_jwt_secret';

//#TODO 应该自动续期
export async function genToken(userModel: JwtUser) {
    const token = jwt.sign(userModel, JWT_SECRET, { expiresIn: '30d' });
    return token;
}
//认证成功返回user,认证失败抛出异常reject
export async function checkToken(token?: string) {
    if (!token) {
        throw new ApiError(ApiErrorCode.Unauthorized, "没有登录");
    }
    try {
        const user = jwt.verify(token, JWT_SECRET) as JwtUser;//#TODO 应该定时更新token来续期
        return user;
    } catch (e) {
        throw new ApiError(ApiErrorCode.Unauthorized, "登录失效");
    }
}

const salt = 'zwyzwyzwy';
export function encryPwd(password: string) {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    const result = hash.digest('hex');
    return result;
}
