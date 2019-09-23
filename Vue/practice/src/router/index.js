import Vue from "vue";
import VueRouter from "vue-router";

// 路由数据
import routes from "./routes";

Vue.use(VueRouter);

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes: [...routes]
});

export default router;
