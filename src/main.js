import {createApp} from 'vue'
import router from "@/router";
import {createPinia} from "pinia";
import {createPersistedState} from "pinia-persistedstate-plugin";
// 导入Vant
import vant from 'vant';
// 引入vant样式
import 'vant/lib/index.css';
// 设置 rem 基准值
import 'amfe-flexible'
// 在桌面端自动将 mouse 事件转换成对应的 touch 事件，使得组件能够在桌面端使用
import '@vant/touch-emulator';
// 使用iconfont图标
import '@/assets/iconfont/iconfont.css'
// 引入全局样式
import '@/assets/css/index.css'


import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
const persist = createPersistedState()
pinia.use(persist)
app
    .use(pinia)
    .use(vant)
    .use(router)
app.mount('#app');