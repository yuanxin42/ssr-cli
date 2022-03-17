import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './route/ssr'

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

const { app, router } = createApp()

router.onReady(() => {
    app.$mount('#app')
})

export default context => {
    // 因为这边 router.onReady 是异步的，所以我们返回一个 Promise
    // 确保路由或组件准备就绪
    return new Promise((resolve, reject) => {
        const { app, router } = createApp(context)
        router.push(context.url)
        router.onReady(() => {
            resolve(app)
        }, reject)
    })
}