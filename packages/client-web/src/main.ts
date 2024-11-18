import { createApp } from 'vue'
import './styles/global.less'
import "./styles/variables.less";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import router from "./router";

import App from './App.vue'
import pinia from './store/pinia';

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(ElementPlus, { size: 'large' });
app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
