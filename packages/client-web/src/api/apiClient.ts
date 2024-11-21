import axios from "axios";
import router from "../router";
import { ApiMap, HEADER_TOKEN_KEY, ApiResultBase, ApiErrorCode } from "@mono/common";
import { getToken } from "../db";
import { ws } from "../sigleton/ws";
const apiClient = axios.create({
    // baseURL: '/',//api
});

apiClient.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers[HEADER_TOKEN_KEY] = token;
    }
    return config;
});

//检查是否登录的拦截器
// apiClient.interceptors.response.use(response => {
//     return response;
// }, error => {
//     if (error.response && error.response.status === 401) {
//         router.push('/login')
//     }
//     return Promise.reject(error);
// });

export async function apiRequest<T extends keyof ApiMap>(path: T, data: ApiMap[T]['request']): Promise<ApiMap[T]['response']> {
    // const res = await ws.request(path, data);
    const res = await apiClient.post(path, data);
    const result = res.data as ApiResultBase;
    if (!result.ok) {
        if (result.errorCode === ApiErrorCode.Unauthorized) {
            router.push('/login');
        }
        throw new Error(result.error);
    }
    return res.data;
}


export { apiClient };
