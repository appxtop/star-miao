import { setToken } from "../db";
import { ws } from "../sigleton/ws";
import { apiRequest } from "./apiClient"
import { PostLoginResult, PostRegisterResult, ResultData } from '@mono/common';

export interface RegisterData {
    username: string;
    nickname: string;
    email: string;
    password: string;
    verCode: string;
}

export async function login(formData: {
    username: string,
    password: string
}) {
    const res = await apiRequest('/api/auth/login', formData);
    const data = res.data as PostLoginResult;
    if (data.ok) {
        setToken(data.token);
        ws.newSocket();
    }
    return data;
}

export async function sendVerCode(formData: {
    email: string
}) {
    const res = await apiRequest('/api/user/sendVerCode', formData);
    const data = res.data as ResultData;
    return data;
}

export async function register(formData: RegisterData) {
    const res = await apiRequest('/api/register/submit', formData);
    const data = res.data as PostRegisterResult;
    if (data.ok) {
        setToken(data.token);
        ws.newSocket();
    }
    return data;
}

export async function checkUsername(username: string) {
    const res = await apiRequest('/api/register/checkUsername', { username });
    return res.data as ResultData;
}
export async function checkEmail(email: string) {
    const res = await apiRequest('/api/register/checkEmail', { email });
    return res.data as ResultData;
}
export async function checkNickname(nickname: string) {
    const res = await apiRequest('/api/register/checkNickname', { nickname })
    return res.data as ResultData;
}

export async function setEmail(formData: { email: string }) {
    const res = await apiRequest('/api/user/setEmail', formData);
    const data = res.data as ResultData;
    return data;
}
export async function setNickname(formData: { nickname: string }) {
    const res = await apiRequest('/api/user/setNickname', formData);
    const data = res.data as ResultData;
    return data;
}
export async function setPassword(formData: { oldPassword: string, password: string }) {
    const res = await apiRequest('/api/user/setPassword', formData);
    const data = res.data as ResultData;
    return data;
}