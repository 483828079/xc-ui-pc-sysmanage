import Home from '@/module/home/page/home';
import page_list from '@/module/cms/page/page_list'; // 导入组件
import page_add from '@/module/cms/page/page_add';
import page_edit from '@/module/cms/page/page_edit';

export default [{ // 指定访问/的时候加载组件。
  path: '/',
  component: Home,
  name: 'CMS',
  hidden: false,
    children:[
      {path:'/cms/page/list',name:'页面列表',component: page_list,hidden:false},
      {path:'/cms/page/add',name:'新增页面',component: page_add,hidden:true},
      {path:'/cms/page/edit/:pageId',name:'修改页面',component: page_edit,hidden:true},
    ]
  }
]


/*
* 猜测流程：
*
* 访问/会加载Home组件，也就是总页面。
* 会把name加载到侧边栏中。
*
* 会把children中的路由的name也加载到侧边栏中。
* 并且使用单页面标签指定path，也就是点击测边栏候会访问path对应的url，路由就会加载对应组件到挂载部分。
*
* 跨域问题：
*   因为前端工程和后端工程不在一个端口上，所以如果直接请求会出现跨域问题。
*   vue cli提供了跨域的方案。
*   因为服务端和服务端之间的请求不存在跨域问题，所以让当前页面去请求nodejs让nodejs去请求后端工程。
*   nodejs作为代理的方式解决跨域问题。
*
* restful格式的url：
*   /cms/page/edit/:pageId 路由地址。
*   访问 /cms/page/edit/123 会被路由使用对应组件渲染页面。
*   可以通过 this.$route.params.id来获取到123.
*
*   /cms/page/edit 路由地址。
*   访问/cms/page/edit?id=123 会被路由使用对应组件渲染页面。
*   可以通过 this.$route.query.id来获取到123.
** */
