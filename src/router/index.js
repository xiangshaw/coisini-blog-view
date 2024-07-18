import {createRouter, createWebHashHistory} from "vue-router";

// 1.创建路由规则
const routes = [
    {
        path: "/login",
        name: "login",
        component: () => import(/* webpackChunkName: "about" */ "../views/login/index.vue"),
    },
    {
        path: "/search",
        name: "search",
        component: () => import(/* webpackChunkName: "about" */ "../views/search/index.vue"),
    },
    {
        path: "/article/:articleId",
        name: "article",
        component: () => import(/* webpackChunkName: "about" */ "../views/article/index.vue"),
        // 路由对应参数映射到组件中
        props: true,
    },
    {
        path: "/",
        name: "layout",
        component: () => import(/* webpackChunkName: "about" */ "../layout/index.vue"),
        // 默认子路由
        children: [
            {
                path: "/",
                name: "home",
                component: () => import(/* webpackChunkName: "about" */ "../views/home/index.vue"),
            },
            {
                path: "/my",
                name: "my",
                component: () => import(/* webpackChunkName: "about" */ "../views/my/index.vue"),
            },
        ]
    },
];

// 2.创建路由实例
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
