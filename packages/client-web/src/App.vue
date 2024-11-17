<script setup lang="ts">
import CardCom from './components/CardCom.vue';
</script>

<template>
  <div class="app">
    <div class="header">
      header
    </div>
    <div class="content">
      <CardCom />
      <CardCom />
    </div>
  </div>
</template>

<style lang="less" scoped>
.app {
  touch-action: none;
  height: 100%;
  background-color: yellow;
  display: flex;
  flex-direction: column;

  &>.header {
    background-color: green;
  }

  &>.content {
    background-color: #94BF94;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }

}
</style>