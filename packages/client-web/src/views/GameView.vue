<template>
  <div ref="comRef" class="game-container">
    <template v-for="item in cards" :key="item._id">
      <CardCom :model="item" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, useTemplateRef, watch } from "vue";
import CardCom from "../components/game/CardCom.vue";
import { gameStore } from "../store/game";
import { ws } from "../sigleton/ws";
import { userStore } from "../store/user";
import { CardModel } from "@mono/common";
import _ from "lodash";
const cards = computed(() => gameStore.card.cards);
// const loadding = ref(true);

watch(() => userStore.user, user => {
  if (user) {
    const channel = 'cards:' + user._id;
    ws.subscribe(channel);
    ws.addListener(channel, (data: {
      gameTime: number,
      cards: {
        [id: string]: CardModel
      }
    }) => {
      gameStore.updateCard(data);
    })
  }
}, {
  immediate: true
});


const comRef = useTemplateRef("comRef");
onMounted(() => {
  const com = comRef.value;
  if (!com) {
    return;
  }
});
</script>

<style lang="less" scoped></style>

<style lang="less" scoped>
.game-container {
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
