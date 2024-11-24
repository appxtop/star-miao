import { client } from "@mono/dbman";
import { comparePwd, genToken } from "../authlib";
import { ApiError } from "@mono/common";
import { ApiMapType } from ".";

export const auth: Pick<ApiMapType, '/api/auth/login'> = {
    "/api/auth/login": {
        fn: async (body: {
            username: string;
            password: string;
        }) => {
            const username = body.username;
            const password = body.password;
            const userModel = await client.collection('users').findOne({
                username
            });
            if (!userModel || !await comparePwd(password, userModel.passwordHash)) {
                throw new ApiError('用户名或密码错误');
            }
            const token = await genToken({ _id: userModel._id });
            return { token };
        }
    }
}



