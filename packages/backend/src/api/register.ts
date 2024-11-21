import { client } from "@mono/dbman";
import { validateEmail, validateNickname, validatePassword, validateUsername, UserModel, ApiError } from "@mono/common";
import { encryPwd, genToken } from "../authlib";
import { checkVercode } from "./user";
import { RoutersType } from "../router";


export const register: Pick<RoutersType,
    | '/api/register/submit'
    | '/api/register/checkEmail'
    | '/api/register/checkNickname'
    | '/api/register/checkUsername'
> = {
    "/api/register/submit": {
        fn: async function (body: {
            username: string;
            password: string;
            nickname: string;
            email: string;
            verCode: string;
        }): Promise<{ token: string; }> {
            const username = body.username;
            const password = body.password;
            const nickname = body.nickname;
            const email = body.email.toLowerCase();
            const usernameLower = username.toLowerCase();
            const verCode = body.verCode;

            validateEmail(email);
            validateNickname(nickname);
            validateUsername(username);
            validatePassword(password);

            await checkVercode(email, verCode);


            const nicknameExists = await client.collection("users").exist({
                nickname
            });
            if (nicknameExists) {
                throw new ApiError('昵称已经存在')
            }

            const usernameExists = await client.collection('users').exist({
                usernameLower
            });
            if (usernameExists) {
                throw new ApiError('用户名已经存在');
            }

            const emailExists = await client.collection('users').exist({ email });
            if (emailExists) {
                throw new ApiError('电子邮箱已被注册');
            }
            const hashedPassword = encryPwd(password);
            const userModel: Partial<UserModel> = {
                username,
                nickname,
                usernameLower,
                password: hashedPassword,
                email,
            };
            const res = await client.collection('users').insertOne(userModel);
            const token = await genToken({ _id: res._id });
            return { token };
        }
    },
    "/api/register/checkEmail": {
        fn: async function (body: { email: string; }): Promise<void> {
            const email = body.email.toLowerCase();
            const exist = await client.collection('users').exist({
                email
            });
            if (exist) {
                throw new ApiError("邮箱已经存在");
            }
        }
    },
    "/api/register/checkUsername": {
        fn: async function (body: { username: string; }): Promise<void> {
            const usernameLower = body.username.toLowerCase();
            const exists = await client.collection('users').exist({
                usernameLower
            });
            if (exists) {
                throw new ApiError('用户名已存在');
            }
        }
    },
    "/api/register/checkNickname": {
        fn: async function (body: { nickname: string; }): Promise<void> {
            const nickname = body.nickname;
            validateNickname(nickname);
            const exists = await client.collection('users').exist({
                nickname
            });
            if (exists) {
                throw new ApiError('昵称已经存在');
            }
        }
    }
}
