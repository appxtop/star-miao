<template>
  <div ref="comRef" class="card-container cursor-default" :style="{ top: model.y + 'px', left: model.x + 'px' }">
    <el-tooltip>
      <template #content>
        <div>
          <template v-if="price">
            价格:
            <div>
              <template v-for="(item, type) in price">
                <template v-if="item">
                  {{ type }}:
                  <span
                    :style="{ color: item.base + item.increment * num > gameStore.card.cards_type[type]![0].num ? 'red' : void 0 }">
                    {{ item.base + item.increment * num }}
                  </span>
                </template>
              </template>
            </div>
          </template>
        </div>
      </template>
      <div class="card-inner">
        <div class="header">
          {{ name }}
          <span class="num"> x{{ num }} </span>
        </div>
        <div class="content">
          <div class="clip" :style="{ backgroundImage: 'url(' + imageUrl + ')' }"></div>
          <div class="footer">
            <div class="num-left" v-if="num_left">
              {{ num_left }}
            </div>
            <div class="num-content"></div>
            <div class="num-right" v-if="num_right">
              {{ num_right }}
            </div>
          </div>

        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { gameStore } from "../../store/game";
import { CardModel, cards } from "@mono/common";
import { apiRequest } from "../../api/apiClient";
import { ElMessage } from "element-plus";
import _ from "lodash";
const props = defineProps<{
  model: CardModel;
}>();

const id = props.model._id;

const model = computed(() => gameStore.card.cards[id]);
const price = computed(() => cards[model.value.type].price)
const name = computed(() => model.value.type);
const num = computed(() => model.value.num);
const imageUrl = computed(() => `/images/${model.value.type}.png`);

const num_left = ref(0); //暂时用不到
const num_right = ref(0);

async function handleClick() {
  if (model.value.type === "猫薄荷") {
    // model.value.num++;
  }
  else if (model.value.type === '猫薄荷田') {
    try {
      const res = await apiRequest('/api/card/buy', { type: '猫薄荷田', num: 1 });
      gameStore.updateCard(res);
      ElMessage.success({
        message: '购买成功',
        grouping: true
      });
    } catch (e: any) {
      ElMessage.error({
        message: '' + e,
        grouping: true
      })
    }
  }
}

type EvtDown = {
  time: number;
  clientX: number;
  clientY: number;
  button: number;
  drag_curClientX: number;
  drag_curClientY: number;
  pointerId: number;
};

let evtDown: EvtDown | null = null;
const comRef = useTemplateRef("comRef");
const classNames = ["cursor-default", "cursor-drag"] as const;
function changeCursor(className: (typeof classNames)[number]) {
  const com = comRef.value;
  if (!com) {
    return;
  }
  classNames.forEach((item) => {
    com.classList.remove(item);
  });
  com.classList.add(className);
}

onMounted(() => {
  const com = comRef.value;
  if (com) {
    com.onpointerdown = (evt) => {
      com.setPointerCapture(evt.pointerId);
      evtDown = {
        time: performance.now(),
        clientX: evt.clientX,
        clientY: evt.clientY,
        button: evt.button,
        drag_curClientX: evt.clientX,
        drag_curClientY: evt.clientY,
        pointerId: evt.pointerId,
      };
      com.style.zIndex = (gameStore.maxCardIndex++).toString();
    };
    com.onpointermove = (evt) => {
      evt.preventDefault();
      if (!evtDown) {
        return;
      }
      const { drag_curClientX, drag_curClientY } = evtDown;
      const offsetX = evt.clientX - drag_curClientX;
      const offsetY = evt.clientY - drag_curClientY;
      //   const computedStyle = getComputedStyle(com);
      //   const curTop = parseFloat(computedStyle.top);
      //   const curLeft = parseFloat(computedStyle.left);
      //   com.style.top = curTop + offsetY + "px";
      //   com.style.left = curLeft + offsetX + "px";

      model.value.x += offsetX;
      model.value.y += offsetY;

      evtDown.drag_curClientX = evt.clientX;
      evtDown.drag_curClientY = evt.clientY;
      changeCursor("cursor-drag");
    };
    com.onpointerup = (evt) => {
      com.releasePointerCapture(evt.pointerId);
      if (!evtDown || evt.pointerId !== evtDown.pointerId) {
        return;
      }
      if (
        evt.button === evtDown.button &&
        performance.now() - evtDown.time < 300 &&
        Math.abs(evtDown.clientX - evt.clientX) < 20 &&
        Math.abs(evtDown.clientY - evt.clientY) < 20
      ) {
        if (evt.button === 0) {
          handleClick();
        }
      }
      evtDown = null;
      changeCursor("cursor-default");
    };
  }
});
</script>

<style lang="less" scoped>
.cursor-drag {
  cursor: move;
  outline: 5px solid red !important;
}

.cursor-default {
  cursor: grab;
}

.card-container {
  position: absolute;
}

.card-inner {
  &:hover {
    outline: 5px solid green;
  }

  width: 250px;
  height: 300px;
  border: 10px solid #1f1f1f;
  border-radius: 5px;
  background-color: #f9f3de;
  user-select: none;
  left: 100px;
  top: 100px;

  &>.header {
    background-color: #f6e8b1;
    height: 50px;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 10px solid #1f1f1f;
    padding: 5px;
    color: #1b1a1a;

    .num {
      color: gray;
      font-size: 15px;
    }
  }

  &>.content {
    padding-top: 15px;

    &>.clip {
      width: 160px;
      height: 160px;
      border-radius: 160px;
      background-color: #f7e8b1;
      margin: auto;
      background-size: cover;
      /* 让背景图片覆盖整个容器 */
      background-position: center;
      /* 将背景图片居中 */
      background-repeat: no-repeat;
      /* 防止背景图片重复 */
    }

    &>.footer {
      display: flex;

      &>.num-left,
      &>.num-right {
        background-color: black;
        width: 50px;
        height: 50px;
        border-radius: 50px;
        color: white;
        text-align: center;
        margin: 2px;
        padding-top: 12px;
        font-weight: bold;
        font-size: 18px;
      }

      &>.num-content {
        flex: 1;
      }
    }
  }
}
</style>
