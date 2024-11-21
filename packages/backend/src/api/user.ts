import { ApiError, KVKeys, log, validateEmail, validateNickname, validatePassword } from "@mono/common";
import { encryPwd } from "../authlib";
import { client } from "@mono/dbman";
import { JwtUser } from "../types";
import { roomEmit, RoomEmitKey_user } from "../socket";
import { sendEmail } from '@mono/common-node';
import { kvClient } from '@mono/dbman';
import { RoutersType } from "../router";

export async function checkVercode(email: string, verCode: string) {
    const verCode_ = await kvClient.get(KVKeys.VERCODE + email);
    if (!verCode_) {
        throw new ApiError('没有验证码');
    }
    if (verCode_ !== verCode) {
        throw new ApiError('验证码不匹配');
    }
}


export const user: Pick<RoutersType,
    | "/api/user/sendVerCode"
    | "/api/user/setEmail"
    | "/api/user/setNickname"
    | "/api/user/setPassword"
> = {
    "/api/user/setPassword": {
        user: true,
        fn: async function (body: { oldPassword: string; newPassword: string; }, user: JwtUser): Promise<void> {
            let oldPassword = body.oldPassword;
            let newPassword = body.newPassword;
            validatePassword(newPassword);

            oldPassword = encryPwd(oldPassword);
            newPassword = encryPwd(newPassword);

            const userModel = await client.collection('users').findOne({
                _id: user._id
            });

            if (!userModel) {
                throw new ApiError('未知错误');
            }

            if (userModel.password !== oldPassword) {
                throw new ApiError('旧密码错误');
            }

            await client.collection('users').update({
                _id: userModel._id
            }, {
                $set: {
                    password: newPassword
                }
            });
        }
    },
    "/api/user/setEmail": {
        user: true,
        fn: async function (body: { email: string; verCode: string; }, user: JwtUser): Promise<void> {
            const email = body.email.toLowerCase();
            const verCode = body.verCode;
            validateEmail(email);
            const emailExists = await client.collection('users').exist({ email });
            if (emailExists) {
                throw new ApiError('电子邮件已被注册');
            }
            await checkVercode(email, verCode);
            //#TODO 数据库应该会有email unique锁吧?
            //#TODO 应该有updateOne方法吧
            const res = await client.collection('users').update({
                _id: user._id
            }, {
                $set: {
                    email
                }
            });

            if (res.modified) {
                const userModel = await client.collection('users').findOne({ _id: user._id }, {
                    password: false
                });
                if (userModel) {
                    roomEmit(RoomEmitKey_user + user._id, 'user', userModel);
                }
            } else {
                throw new ApiError('未知错误');
            }

        }
    },
    "/api/user/setNickname": {
        user: true,
        fn: async function (body: { nickname: string; }, user: JwtUser): Promise<void> {
            const nickname = body.nickname;
            validateNickname(nickname);
            const nicknameExist = await client.collection('users').exist({ nickname });
            if (nicknameExist) {
                throw new ApiError('昵称已被注册');
            }

            const res = await client.collection('users').update({
                _id: user._id
            }, {
                $set: {
                    nickname
                }
            });

            if (res.modified) {
                const userModel = await client.collection('users').findOne({ _id: user._id }, {
                    password: false
                });
                if (userModel) {
                    roomEmit(RoomEmitKey_user + user._id, 'user', userModel);
                }
            } else {
                throw new ApiError('未知错误');
            }
        }
    },
    "/api/user/sendVerCode": {
        fn: async function (body: { email: string; }): Promise<void> {
            const email = body.email.toLowerCase();
            const verCode = Math.floor(100000 + Math.random() * 900000).toString();
            const exp_min = 20;//分钟
            const text = `你的验证码是:${verCode},有效期:${exp_min}分钟`
            log(text);
            await sendEmail(email, { subject: '验证邮箱验证码', text })
            await kvClient.setex(KVKeys.VERCODE + email, 60 * exp_min, verCode);
        }
    }
}

