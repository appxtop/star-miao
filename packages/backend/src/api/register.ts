import { client } from "@mono/dbman";
import { validateEmail, validateNickname, validatePassword, validateUsername, PostRegisterResult, UserModel } from "@mono/common";
import { encryPwd, genToken } from "../authlib";

export async function check_email(body: { email: string }) {
    const email = body.email.toLowerCase();
    const exist = await client.collection('users').exist({
        email
    });
    if (exist) {
        throw new Error("邮箱已经存在");
    }
}

export async function check_username(body: { username: string }) {
    const usernameLower = body.username.toLowerCase();
    const exists = await client.collection('users').exist({
        usernameLower
    });
    if (exists) {
        throw new Error('用户名已存在');
    }
}

export async function check_nickname(body: { nickname: string }) {
    const nickname = body.nickname;
    validateNickname(nickname);
    const exists = await client.collection('users').exist({
        nickname
    });
    if (exists) {
        throw new Error('昵称已经存在');
    }
}

export async function submit(body: {
    username: string;
    password: string;
    nickname: string;
    email: string;
}): Promise<PostRegisterResult> {
    const username = body.username;
    const password = body.password;
    const nickname = body.nickname;
    const email = body.email.toLowerCase();
    const usernameLower = username.toLowerCase();

    validateEmail(email);
    validateNickname(nickname);
    validateUsername(username);
    validatePassword(password);

    const nicknameExists = await client.collection("users").exist({
        nickname
    });
    if (nicknameExists) {
        throw new Error('昵称已经存在');
    }

    const usernameExists = await client.collection('users').exist({
        usernameLower
    });
    if (usernameExists) {
        throw new Error('用户名已经存在');
    }

    const emailExists = await client.collection('users').exist({ email });
    if (emailExists) {
        throw new Error('电子邮箱已被注册');
    }
    const hashedPassword = encryPwd(username, password);
    const userModel: Partial<UserModel> = {
        username,
        nickname,
        usernameLower,
        password: hashedPassword,
        email,
    }
    const res = await client.collection('users').insertOne(userModel);
    const token = await genToken({ _id: res._id, username: userModel.username! });
    return { token };
}