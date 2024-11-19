<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="formData" :rules="loginRules" class="login-form">
            <div class="title-container">
                <h3 class="title">修改密码</h3>
            </div>
            <el-form-item prop="oldPassword">
                <el-input v-model="formData.oldPassword" placeholder="请输入老密码" show-password>
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <unlock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="newPassword">
                <el-input v-model="formData.newPassword" placeholder="请输入新密码" show-password>
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <unlock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword">
                <el-input placeholder="请再次输入一次密码" show-password v-model="formData.confirmPassword">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <unlock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <div class="error-msg">
                {{ errorMsg }}
            </div>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                @click.native.prevent="handleSubmit">修改密码</el-button>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { validatePassword } from '@mono/common';
import router from '../../router';
import { apiRequest } from '../../api/apiClient';

const loginForm = ref<any>();
const formData = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});
const loading = ref(false);
const errorMsg = ref('');
function handleSubmit() {
    errorMsg.value = '';
    loginForm.value.validate(async (valid: boolean) => {
        try {
            if (valid) {
                loading.value = true;
                const data = { ...formData.value };
                try {
                    await apiRequest('/api/user/setPassword', data);
                    ElMessageBox.alert('修改成功').then(() => {
                        router.push('/user');
                    })
                } catch (e: any) {
                    errorMsg.value = e.message;
                }
            } else {
                ElMessageBox.alert('请正确输入每一项')
            }
        } catch (e: any) {
            ElMessageBox.alert('出错了:' + e.message)
        } finally {
            loading.value = false;
        }
    })
}


const loginRules = {
    oldPassword: [
        {
            validator: async (_rule: any, value: string) => {
                validatePassword(value);
            },
            trigger: 'blur'
        }
    ],
    newPassword: [
        {
            validator: async (_rule: any, value: string) => {
                validatePassword(value);
            },
            trigger: 'blur'
        }
    ],
    confirmPassword: [
        {
            validator: async (_rule: any, value: string) => {
                validatePassword(value);
                if (value === '') {
                    throw new Error('请再次输入密码');
                } else if (value !== formData.value.newPassword) {
                    throw new Error('两次输入的密码不一致!');
                }
            },
            trigger: 'blur'
        }
    ]
}
</script>

<style lang="less" scoped>
.login-container {
    background-color: var(--background-color);
    height: 100%;

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: white;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;

        .el-input {
            color: white;
        }
    }

    .error-msg {
        color: red;
        margin-bottom: 10px;
    }
}
</style>