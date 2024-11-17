<template>
    <div draggable="true" ref="comRef" class="cardBox-container">

    </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';


const comRef = useTemplateRef('comRef');
onMounted(() => {

    const com = comRef.value;
    if (com) {
        com.ondragstart = (_e) => {
            console.log('start');
        }
        com.ondragover = (e) => {
            console.log("over");
            e.preventDefault();
        }
        com.ondragenter = (_e) => {
            console.log('enter');
            com.classList.add('gray-class');
        }
        com.ondragend = (_e) => {
            console.log('end');
            com.classList.remove('gray-class');
        }
    }
})

</script>


<style lang="less" scoped>
.cardBox-container {
    background-color: red;
    width: 300px;
    height: 300px;



}

.gray-class {
    background-color: gray;
}
</style>
