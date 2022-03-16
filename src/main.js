import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './route'

// ssr 防止状态污染，保证每一个用户获取到一个新的实例
export function createApp (ssrContext) {
    const router = createRouter()
    const app = new Vue({
        router,
        ssrContext,
        render: h => h(App)
    })
    return { app, router }
}