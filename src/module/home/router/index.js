import Home from '@/module/home/page/home.vue'; // 导入组件
export default [{ // 指定访问/的时候加载组件。
    path: '/',
    component: Home,
    name: '系统管理首页',
    hidden: true
    // ,
    // redirect: '/home',
    // children: [
    //   {path: 'home', component: Home}
    // ]
  }/*,
  {
    path: '/login',
    component: Login,
    name: 'Login',
    hidden: true
  }*/
]
