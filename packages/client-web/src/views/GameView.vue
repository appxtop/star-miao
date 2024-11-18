<template>
  <div ref="comRef" class="game-container">
    <template v-for="item in cards" :key="item._id">
      <CardCom :model="item" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import { CardModel } from "@mono/common";
import CardCom from "../components/game/CardCom.vue";

const cards: CardModel[] = [
  {
    _id: "aaa",
    type: "猫薄荷",
    num: 1,
    room: "",
    user: "",
    x: 100,
    y: 100,
  },
  {
    _id: "bbb",
    type: "猫薄荷田",
    num: 3,
    room: "",
    user: "",
    x: 300,
    y: 200,
  },
];

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
