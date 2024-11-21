import { ApiErrorCode } from "../error";

export interface ApiResultBase {
    ok?: 1;
    error?: string;
    errorCode?: ApiErrorCode;
}

export interface ApiMap {
    "/api/register/submit": {
        request: {
            username: string;
            password: string;
            nickname: string;
            email: string;
            verCode: string;
        };
        response: { token: string };
    },
    '/api/register/checkUsername': {
        request: { username: string };
        response: void;
    },
    '/api/register/checkEmail': {
        request: { email: string };
        response: void;
    },
    '/api/register/checkNickname': {
        request: { nickname: string };
        response: void;
    },
    '/api/auth/login': {
        request: { username: string, password: string };
        response: { token: string };
    },
    '/api/user/setPassword': {
        request: { oldPassword: string; newPassword: string; },
        response: void;
    },
    '/api/user/setEmail': {
        request: { email: string; verCode: string },
        response: void;
    },
    '/api/user/setNickname': {
        request: { nickname: string },
        response: void;
    },
    '/api/user/sendVerCode': {
        request: { email: string },
        response: void
    }
}

// export type ApiType<T extends keyof ApiMap> = {
//     request: ApiMap[T]['request'],
//     response: ApiMap[T]['response']
// }


// async function apiCall<T extends keyof ApiMap>(apiName: T, requestData: ApiType<T>['request']): Promise<ApiType<T>['response']> {
//     const response = {} as ApiType<T>['response'];
//     return response;
// }

