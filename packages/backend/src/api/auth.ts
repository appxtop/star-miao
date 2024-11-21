import { client } from "@mono/dbman";
import { encryPwd, genToken } from "../authlib";
import { RoutersType } from "../router";
import { ApiError, ApiErrorCode } from "@mono/common";

export const auth: Pick<RoutersType, '/api/auth/login'> = {
    "/api/auth/login": {
        fn: async (body: {
            username: string;
            password: string;
        }) => {
            const username = body.username;
            const password = body.password;
            const userModel = await client.collection('users').exist({
                username,
                password: encryPwd(password)
            });
            if (!userModel) {
                throw new ApiError(ApiErrorCode.Message, '用户名或密码错误');
            }
            const token = await genToken({ _id: userModel._id });
            return { token };
        }
    }
}



