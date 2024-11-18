import { UserModel } from "@mono/common";
import { defineStore } from "pinia";
import pinia from "./pinia";

const useUserStore = defineStore('user', {
    state() {
        const state: {
            user: UserModel | null | 0,
        } = {
            user: 0 //还没有连接
        }
        return state;
    },
    actions: {
        updateUser(user: UserModel | null) {
            this.user = user;
        }
    }
});


export const userStore = useUserStore(pinia);