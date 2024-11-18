const LOCALSTORAGE_TOKEN_KEY = 'token';
export function getToken() {
    return localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
}
export function setToken(token: string) {
    localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, token);
}
