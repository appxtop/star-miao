import { validateEmail, validateNickname, validatePassword } from "@mono/common";
import { encryPwd } from "../authlib";
import { client } from "@mono/dbman";
import { ShortUser } from "../types";
import { roomEmit, RoomEmitKey_user } from "../socket";

export async function set_password(body: {
    oldPassword: string;
    newPassword: string;
}, user: ShortUser) {

    let oldPassword = body.oldPassword;
    let newPassword = body.newPassword;
    validatePassword(newPassword);

    oldPassword = encryPwd(user.username, oldPassword);
    newPassword = encryPwd(user.username, newPassword);

    const userModel = await client.collection('users').findOne({
        _id: user._id
    });

    if (!userModel) {
        throw new Error('未知错误');
    }

    if (userModel.password !== oldPassword) {
        throw new Error('旧密码错误');
    }

    await client.collection('users').update({
        _id: userModel._id
    }, {
        $set: {
            password: newPassword
        }
    });

}

export async function set_email(body: { email: string }, user: ShortUser) {
    const email = (body.email + '').toLowerCase();
    validateEmail(email);
    const emailExists = await client.collection('users').exist({ email });
    if (emailExists) {
        throw new Error('电子邮件已被注册');
    }
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
        throw new Error('未知错误');
    }

}

export async function set_nickname(body: { nickname: string }, user: ShortUser) {
    const nickname = body.nickname + '';
    validateNickname(nickname);
    const nicknameExist = await client.collection('users').exist({ nickname });
    if (nicknameExist) {
        throw new Error('昵称已被注册');
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
        throw new Error('未知错误');
    }


}