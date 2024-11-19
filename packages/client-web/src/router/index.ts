import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/login/LoginView.vue';
import RegisterView from '../views/register/RegisterView.vue';
import UserView from '../views/user/UserView.vue';
import ModifyPasswordView from '../views/user/ModifyPasswordView.vue';
import SettingsView from '../views/settings/SettingsView.vue';
import GameView from '../views/GameView.vue';
const routes: { path: string, component: any }[] = [
    {
        path: '/',
        component: HomeView
    }, {
        path: "/login",
        component: LoginView
    }, {
        path: '/register',
        component: RegisterView
    }, {
        path: '/user',
        component: UserView
    }, {
        path: '/user/modify-password',
        component: ModifyPasswordView
    },
    {
        path: '/settings',
        component: SettingsView
    }, {
        path: '/game',
        component: GameView
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
});


export function routeSource(path: string) {
    router.push(path);
}

export default router;
