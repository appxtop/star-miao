<template>
  <div class="header-container">
    <div class="logo-container">
      <RouterLink to="/" class="link">
        <img fill="red" style="fill: true" class="logo" src="/logo.svg" />
        Miao
      </RouterLink>
    </div>
    <div class="menu-container">
      <el-dropdown v-if="user">
        <span class="el-dropdown-link menu-link">
          {{ user.nickname + "(" + user.username + ")" }}
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleGoToUserProfile()">
              个人中心
            </el-dropdown-item>
            <el-dropdown-item @click="handleGoToSettings()">
              设置
            </el-dropdown-item>
            <el-dropdown-item @click="handleLogout()">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <template v-else-if="user === null">
        <router-link to="/login" class="menu-link" :class="{ active: isActive('/login') }">
          登录
        </router-link>
        <router-link to="/register" class="menu-link" :class="{ active: isActive('/register') }">
          注册
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
// import { userStore } from '../store/user';
import router from "../router";
const user = computed(() => userStore.user);

import { useRoute } from "vue-router";
import { userStore } from "../store/user";
import { setToken } from "../db";
const route = useRoute();
function isActive(path: string) {
  return route.path === path;
}
function handleGoToUserProfile() {
  router.push("/user");
}
function handleGoToSettings() {
  router.push("/settings");
}
function handleLogout() {
  setToken("");
  userStore.updateUser(null);
  router.push("/login");
}
</script>

<style lang="less" scoped>
.header-container {
  height: var(--header-height);
  background-color: #2f3138;
  display: flex;
  padding-left: 32px;
  padding-right: 12px;
  border-bottom: 1px solid var(--header-border-color);

  .logo-container {
    padding: 2px;

    &>.link {
      text-decoration: none;
      line-height: var(--header-height);

      .logo {
        height: 100%;
      }
    }
  }

  .menu-container {
    flex: 1;
    text-align: right;

    .menu-link {
      padding: 0 10px;
      display: inline-block;
      line-height: calc(var(--header-height) - 2px);
      font-size: 14px;
      text-decoration: none;
      align-items: center;
      color: var(--text-color);
      border-bottom: 2px solid transparent; //占位置

      &:hover {
        color: aqua;
      }

      &.active {
        border-bottom-color: #409eff;
      }
    }
  }
}
</style>
