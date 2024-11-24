<template>
    <div class="user-container">
        用户中心
        <template v-if="user">
            <div>
                用户名:{{ user.username }}
            </div>
            <div>
                昵称:{{ user.nickname }}
                <el-button @click="handleEditNickname()" type="primary">修改</el-button>
            </div>
            <div>
                邮箱:{{ user.email }}
                <el-button @click="handleEditEmail()" type="primary">修改</el-button>
            </div>
            <div>
                密码:
                <router-link to="/user/modify-password">修改</router-link>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { validateEmail, validateNickname } from '@mono/common';
import { userStore } from '../../store/user';
import { apiRequest } from '../../api/apiClient';
const user = computed(() => userStore.user);

function handleEditNickname() {
    ElMessageBox.prompt('请输入新昵称', '修改昵称', {
        inputValidator: (val) => {
            validateNickname(val);
            return true;
        }
    })
        .then(async val => {
            try {
                await apiRequest('/api/user/setNickname', { nickname: val.value });
                ElMessage({
                    type: 'success',
                    message: '修改成功'
                });
            } catch (e) {
                ElMessage({
                    type: 'error',
                    message: '出错了:' + e
                })
            }
        });

}
function handleEditEmail() {
    ElMessageBox.prompt('请输入新邮箱', '修改邮箱', {
        inputValidator: (val) => {
            validateEmail(val);
            return true;
        }
    })
        .then(async val => {
            try {
                await apiRequest('/api/user/setEmail', { email: val.value, verCode: '' });
                ElMessage({
                    type: 'success',
                    message: '修改成功'
                });
            } catch (e) {
                ElMessage({
                    type: 'error',
                    message: '出错了:' + e
                })
            }
        });

}


</script>

<style lang="less" scoped>
.user-container {
    background-color: green;
}
</style>