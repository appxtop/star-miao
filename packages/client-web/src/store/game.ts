import { defineStore } from "pinia";
import pinia from "./pinia";

const useGameStore = defineStore('game', {
    state() {
        const state: {
            maxCardIndex: number
        } = {
            maxCardIndex: 1
        }
        return state;
    },
    actions: {
    }
});

export const gameStore = useGameStore(pinia);