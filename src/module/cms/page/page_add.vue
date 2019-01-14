<template>
  <div style="margin: 28px 0 0 0">
    <!--v-bind:model 将pageForm的值显示在页面上
      不同于v-model的双向绑定，这里只是响应式，只做响应。
      下面的每个form组件才是真的双向绑定。

      prop：表单校验的时候用来关联要校验的表单。
      :rules：校验的对象。
      status-icon 加上校验状态图标
    -->
    <el-form :model="pageForm" status-icon :rules="pageFormRules" label-width="80px" ref="pageForm" >
      <el-form-item label="所属站点" prop="siteId">
        <el-select v-model="pageForm.siteId" placeholder="请选择站点" clearable>
          <el-option
            v-for="item in siteList"
            :key="item.siteId"
            :label="item.siteName"
            :value="item.siteId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择模版" prop="templateId" >
        <el-select v-model="pageForm.templateId" placeholder="请选择" >
          <el-option
            v-for="item in templateList"
            :key="item.templateId"
            :label="item.templateName"
            :value="item.templateId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面名称" prop="pageName">
        <el-input v-model="pageForm.pageName" auto-complete="off" ></el-input>
      </el-form-item>
      ​
      <el-form-item label="别名" prop="pageAliase">
        <el-input v-model="pageForm.pageAliase" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="访问路径" prop="pageWebPath">
        <el-input v-model="pageForm.pageWebPath" auto-complete="off" ></el-input>
      </el-form-item>
      ​
      <el-form-item label="物理路径" prop="pagePhysicalPath">
        <el-input v-model="pageForm.pagePhysicalPath" auto-complete="off" ></el-input>
      </el-form-item>
      ​
      <el-form-item label="类型">
        <el-radio-group v-model="pageForm.pageType">
          <!--这里label属性是实际的值-->
          <el-radio class="radio" label="0">静态</el-radio>
          <el-radio class="radio" label="1">动态</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker type="datetime" placeholder="创建时间" v-model="pageForm.pageCreateTime"></el-date-picker>
      </el-form-item>
      ​
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addSubmit" icon="el-icon-circle-check">提交</el-button>
      <el-button type="primary" @click="go_back" icon="el-icon-back">返回</el-button>
    </div>
  </div>
</template>

<script>
  import * as cmsApi from '../api/cms' // 导入cms下的所有导出对象。并且作为cmsApi的属性。
  import { MessageBox } from 'element-ui';
  export default {
    data() {
      return {
        //新增界面数据,会直接初始化到页面上。
        pageForm: {
          siteId:'',
          templateId:'',
          pageName: '',
          pageAliase: '',
          pageWebPath: '',
          pageParameter:'',
          pagePhysicalPath:'',
          pageType:'0',
          pageCreateTime: new Date()
        },
        siteList:[], // 用来初始化下拉框的site列表
        templateList: [], //用来初始化下拉框的template列表
        // 校验规则，只要表单上的prop对应对象中的属性,然后设置值就可以了。
        pageFormRules: {
          siteId:[
            {required: true, message: '请选择站点', trigger: 'blur'}
          ],
          templateId:[
            {required: true, message: '请选择模版', trigger: 'blur'}
          ],
          pageName: [
            {required: true, message: '请输入页面名称', trigger: 'blur'}
          ],
          pageWebPath: [
            {required: true, message: '请输入访问路径', trigger: 'blur'}
          ],
          pagePhysicalPath: [
            {required: true, message: '请输入物理路径', trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      addSubmit() {
        // $refs.pageForm 获取标注了ref属性pageForm值的元素对象。
        // validate 方法，传入一个返回，会回调该方法并传入参数。
        // 传入true就是表单校验成功，false就是表单校验失败。
        this.$refs.pageForm.validate((valid) => {
          if (valid) { // 表单校验成功
            // 调用api传入要保存的对象
            cmsApi.page_add(this.pageForm).then((rep) => {
              MessageBox.confirm('是否要保存?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                if (rep.success) { // 保存成功
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                } else { // 保存失败
                  this.$message({
                    type: 'error',
                    message: '添加失败!'
                  });
                }
              });
            })
          }
        })
      },
      go_back() {
        // 跳转回列表页面。
        // 很明显这里是组件的两个属性
        // $router 会有路由的一些方法。 push添加一些参数都是和url相关的。
        // path 就是路由跳转的页面，query就是要跳转url上的参数
        // $route 代表的是当前路由对象，可以从路由对象上拿到当前路由相关信息。这里拿到的是url上的参数。
        /**
         * a、通过在路由上添加key/value串使用this.$route.query来取参数，例如：/router1?id=123 ,/router1?id=456 可以通过this.$route.query.id获取参数id的值。
          b、通过将参数作为路由一部分进行传参数使用this.$route.params来获取，例如：定义的路由为/router1/:id ，请求/router1/123时可以通过this.$route.params.id来获取，此种情况用this.$route.query.id是拿不到的。
         * */
        this.$router.push({path:"/cms/page/list", query: {
            page: this.$route.query.page,
            siteId: this.$route.query.siteId,
            templateId: this.$route.query.templateId,
            pageAliase: this.$route.query.pageAliase
          }});
      }
    },
    created() {
      // 页面渲染前加载siteList
      cmsApi.site_all().then((res) => {
        this.siteList = res.queryResult.list;
      });

      // 页面渲染前加载templateList
      cmsApi.template_all().then((res) => {
        this.templateList = res.queryResult.list;
      });

    }
  }
</script>
