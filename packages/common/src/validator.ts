import validator from "validator";
export function validateEmail(email: string) {
    if (!email) {
        throw new Error('邮箱不能为空');
    }
    if (!validator.isEmail(email)) {
        throw new Error('邮箱格式无效')
    }
}
export function validateUsername(username: string) {
    if (!username) {
        throw new Error('用户名不能为空');
    }
    // 验证用户名  
    if (!validator.isLength(username, { min: 3, max: 30 })) {
        throw new Error('用户名长度必须在3到30个字符之间');
    }
    if (!validator.matches(username, /^[a-zA-Z0-9_-]+$/)) {
        throw new Error('用户名只能包含字母、数字、下划线和短横线');
    }
}
export function validatePassword(password: string) {
    if (!password) {
        throw new Error('密码不能为空');
    }
    // 验证密码  
    if (!validator.isLength(password, { min: 8 })) {
        throw new Error('密码长度至少为8个字符');
    }
}

export function validateNickname(nickname: string) {
    if (!nickname) {
        throw new Error('昵称不能为空');
    }
    // 验证昵称  
    if (!validator.isLength(nickname, { min: 2, max: 50 })) {
        throw new Error('昵称长度必须在2到50个字符之间');
    }
}
