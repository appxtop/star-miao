import { client } from "@mono/dbman";
import { encryPwd, genToken } from "../authlib";
import { RoutersType } from "../router";

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
                password: encryPwd(username, password)
            });
            if (!userModel) {
                throw new Error('用户名或密码错误');
            }
            const token = await genToken({ _id: userModel._id, username });
            return { token };
        }
    }
}



