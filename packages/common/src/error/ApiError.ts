
export enum ApiErrorCode {
    SystemError = 1500,
    Unauthorized = 1401,
    ApiNotFound = 1404,
    Message = 1201,
    ParamsError = 1501
}
export const apiErrorMessages: { [code in ApiErrorCode]: string } = {
    1500: "系统异常",
    1401: "账号未认证",
    1404: "Api不存在",
    1201: "消息异常",
    1501: "参数错误"
} as const;

export class ApiError extends Error {
    errorCode: ApiErrorCode;
    error?: string;
    constructor(error: string)
    constructor(errorCode: ApiErrorCode, error?: string)
    constructor(errorOrCode: string | ApiErrorCode, error?: string) {
        let errorCode: ApiErrorCode;
        if (typeof errorOrCode === 'number') {
            errorCode = errorOrCode as ApiErrorCode;
        } else {
            errorCode = ApiErrorCode.Message;
            error = errorOrCode;
        }
        let message = errorCode === ApiErrorCode.Message ? error : apiErrorMessages[errorCode] + ':' + error;
        super(message);
        this.errorCode = errorCode;
        this.error = error;
    }
}
