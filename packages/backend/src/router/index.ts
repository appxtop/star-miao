import { login } from "../api/auth";
import { check_email, check_nickname, check_username, submit } from "../api/register";
import { sendVerCode, set_email, set_nickname, set_password } from "../api/user";
import { ShortUser } from "../types";
type RouterItem01 = {
    path: string;
    user: true;
    fn: (body: any, user: ShortUser) => Promise<any>;
}
type RouterItem02 = {
    path: string;
    user?: false;
    fn: (body: any) => Promise<any>
}
type RouterItem = RouterItem01 | RouterItem02;

const routers: RouterItem[] = [
    {
        path: '/api/register/submit',
        fn: submit
    }, {
        path: '/api/register/check-username',
        fn: check_username,
    }, {
        path: '/api/register/check-email',
        fn: check_email
    }, {
        path: '/api/register/check-nickname',
        fn: check_nickname
    }, {
        path: '/api/auth/login',
        fn: login,
    }, {
        path: '/api/user/set-password',
        user: true,
        fn: set_password,
    }, {
        path: '/api/user/set-email',
        user: true,
        fn: set_email
    }, {
        path: '/api/user/set-nickname',
        user: true,
        fn: set_nickname
    }, {
        path: '/api/user/sendVerCode',
        fn: sendVerCode
    }
]

export default routers;