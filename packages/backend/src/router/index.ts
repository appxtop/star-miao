import { login } from "../api/auth";
import { checkEmail, checkNickname, checkUsername, submit } from "../api/register";
import { sendVerCode, setEmail, setNickname, setPassword } from "../api/user";
import { ShortUser } from "../types";
type RouterItem01 = {
    user: true;
    fn: (body: any, user: ShortUser) => Promise<any>;
}
type RouterItem02 = {
    user?: false;
    fn: (body: any) => Promise<any>
}
type RouterItem = (RouterItem01 | RouterItem02) & { path: string };

const routers: RouterItem[] = [
    {
        path: '/api/register/submit',
        fn: submit
    }, {
        path: '/api/register/checkUsername',
        fn: checkUsername,
    }, {
        path: '/api/register/checkEmail',
        fn: checkEmail
    }, {
        path: '/api/register/checkNickname',
        fn: checkNickname
    }, {
        path: '/api/auth/login',
        fn: login,
    }, {
        path: '/api/user/setPassword',
        user: true,
        fn: setPassword,
    }, {
        path: '/api/user/setEmail',
        user: true,
        fn: setEmail
    }, {
        path: '/api/user/setNickname',
        user: true,
        fn: setNickname
    }, {
        path: '/api/user/sendVerCode' as const,
        fn: sendVerCode
    }
];

export default routers;