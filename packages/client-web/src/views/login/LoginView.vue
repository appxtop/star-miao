<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="formData" :rules="loginRules" class="login-form">
            <div class="title-container">
                <h3 class="title">账号登录</h3>
            </div>
            <el-form-item prop="username">
                <el-input v-model="formData.username" placeholder="请输入用户名">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <user />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="formData.password" placeholder="请输入密码" show-password>
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
                @click.native.prevent="handleSubmit">登录</el-button>
            <div>
                没有账号? 点击<router-link :to="{ path: '/register' }">注册</router-link>
            </div>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../../api/user';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { validatePassword, validateUsername } from '@mono/common';


const router = useRouter();
const loginForm = ref<any>();
const formData = ref({
    username: 'test',
    password: 'test123456',
});
const loading = ref(false);
const errorMsg = ref('');
function handleSubmit() {
    errorMsg.value = '';
    loginForm.value.validate(async (valid: boolean) => {
        try {
            if (valid) {
                loading.value = true;
                const data: any = { ...formData.value };
                delete data.confirmPassword;
                const res = await login(data);
                if (res.ok) {
                    router.push('/');
                } else {
                    if (res.error) {
                        errorMsg.value = res.error;
                    }
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
    username: [
        {
            validator: async (_rule: any, value: string) => {
                validateUsername(value);
            },
            trigger: 'blur'
        }
    ],
    password: [
        {
            validator: async (_rule: any, value: string) => {
                validatePassword(value);
            },
            trigger: 'blur'
        }
    ],
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