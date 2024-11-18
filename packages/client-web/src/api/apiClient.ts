import axios from "axios";
import router from "../router";
import { ws } from "../sigleton/ws";
const apiClient = axios.create({
    // baseURL: '/',//api
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-token'] = `${token}`;
    }
    return config;
});

//检查是否登录的拦截器
apiClient.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        router.push('/login')
    }
    return Promise.reject(error);
});

export async function apiRequest(path: string, data: any) {
    const res = await ws.request(path, data);
    // const res = await apiClient.post(path, data);
    return { data: res.data };


}

export { apiClient };
