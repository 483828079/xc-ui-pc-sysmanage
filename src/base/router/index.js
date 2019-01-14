import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
// 定义路由配置
let routes = [];
// 定义一个方法，可以使用该方法将路由添加进routes数组中。
// 导出给main.js的就是这些多个路由。
let concat = (router) => {
  routes = routes.concat(router)
};
// // 导入路由规则
//import HomeRouter from '@/module/home/router'
import CmsRouter from '@/module/cms/router'
// 合并路由规则
//concat(HomeRouter);
concat(CmsRouter);

export default routes;
