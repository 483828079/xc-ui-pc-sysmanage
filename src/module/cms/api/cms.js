import http from './../../../base/api/public' // 引入的是public中的工具类，封装了axios的请求。
import querystring from 'querystring' // 引入对查询字符串进行处理的方法
let sysConfig = require('@/../config/sysConfig'); // 引入了config下的sysConfig中的sysConfig对象。
let apiUrl = sysConfig.xcApiUrlPre;

// 导出一个page_list的方法，调用传入page si ze params获取的是axios的get请求。
// then 可以回调得到请求的内容。

export const page_list  = (page, size, params) => {
  // params是javascript对象，要想使用get请求需要把它转换为key=value&key=value的形式。
  let paramsInfo = querystring.stringify(params);
  return http.requestQuickGet(apiUrl+'/cms/page/list/'+page+'/'+size + "?" + paramsInfo);
};

// 导出site_all方法
export const site_all  = () => {
  return http.requestQuickGet(apiUrl+'/cms/site/all');
};

// 导出template_all方法
export const template_all  = () => {
  return http.requestQuickGet(apiUrl+'/cms/template/all');
};


/*页面添加*/
export const page_add = params => {
  return http.requestPost(apiUrl+'/cms/page/add',params)
};

/**
 *
 * 请求的流程：
 *
 * sysConfig.js 提供了
 * 一个对象 sysConfig 对应的属性
 *  xcApiUrlPre: '/api'。
 *  也就是在当前js使用sysConfig.xcApiUrlPre 代表的就是/api。
 *
 * 再看config/index.js。 这里提供了跨域的解决方法，也就是nodejs代理。
 * /api/cms': {
        target: 'http://localhost:31001',
        pathRewrite: { // 去掉url中的api
          '^/api': ''
        }
   也就是如果请求/api/cms开头的url，真正请求的会是http://localhost:31001这个服务器。
   例如：
    请求这个页面：/api/cms/page/list/'+page+'/'+size。
    因为是/api/cms开头的请求，所以会被代理。
      http://localhost:31001/api/cms/page/list/'+page+'/'+size。
      这个就是实际的请求地址，pathRewrite设置了将URL中的api替换为''。
      最终代理请求的是http://localhost:31001/cms/page/list/'+page+'/'+size。
      完成了代理的请求。


   其中两个配置文件。
    config/sysConfig.js 配置了一些url方便使用。
    config/index.js 配置了请求的代理用来解决跨域问题。
 * */

