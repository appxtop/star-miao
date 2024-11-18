import { PostLoginResult } from "@mono/common";
import { client } from "@mono/dbman";
import { encryPwd, genToken } from "../authlib";

export async function login(body: {
    username: string,
    password: string
}): Promise<PostLoginResult> {
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

