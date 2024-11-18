export interface ResultData {
    ok?: 1;
    error?: string;
}

export interface PostLoginResult extends ResultData {
    token: string;
}
export interface PostRegisterResult extends PostLoginResult {
}
