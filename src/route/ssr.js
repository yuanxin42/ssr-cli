import Vue from 'vue'
import Router from 'vue-router'
import comp1 from '../views/page1'
Vue.use(Router)
export function createRouter () {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            {
                path: '/comp1',
                component: comp1
            }
        ]
    })
}