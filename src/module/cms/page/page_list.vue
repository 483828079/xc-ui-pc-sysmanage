<template>
  <div>
    <el-form :model="params">
    <!--v-model用来绑定和选择后回显-->
    <el-select v-model="params.siteId" clearable placeholder="站点">
      <!--
        key 作为当前option唯一标志，优化加载。
        label 就是作为option的显示内容
        value 作为option真正的值
      -->
      <el-option
        v-for="item in siteList"
        :key="item.siteId"
        :label="item.siteName"
        :value="item.siteId">
      </el-option>
    </el-select>
    <el-select v-model="params.templateId" clearable placeholder="模板">
      <!--
        key 作为当前option唯一标志，优化加载。
        label 就是作为option的显示内容
        value 作为option真正的值
      -->
      <el-option
        v-for="item in templateList"
        :key="item.templateId"
        :label="item.templateName"
        :value="item.templateId">
      </el-option>
    </el-select>
      <el-select v-model="params.pageType" clearable placeholder="页面类型">
        <el-option
          v-for="item in pageTypeList"
          :key="item.type"
          :label="item.typeDescription"
          :value="item.type">
        </el-option>
      </el-select>
    <el-input
      placeholder="别名"
      style="width: 100px"
      v-model="params.pageAliase"
      clearable>
    </el-input>
      <el-input
        placeholder="名称"
        style="width: 100px"
        v-model="params.pageName"
        clearable>
      </el-input>
    <el-button @click="query" icon="el-icon-search" type="primary" size="small" style="margin: 17px 0px 13px 5px;">查询</el-button>

    <!--
      router-link路由的页面跳转，会改变url但是不是真的跳转。
      由js监听url改变然后使用路由对应组件渲染挂载页面。
      query 给url上加上参数。 参数就是当前页和查询条件,用来作返回的时候回显。
    -->
    <router-link class="mui-tab-item" :to="{path:'/cms/page/add/',query:{
    page: this.params.page,
    siteId: this.params.siteId,
    templateId: this.params.templateId,
    pageType: this.params.pageType,
    pageAliase: this.params.pageAliase,
    pageName: this.params.pageName
    }}">
      <el-button  type="primary" size="small" icon="el-icon-news">新增页面</el-button>
    </router-link>
    </el-form>
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="pageName" label="页面名称" width="120">
      </el-table-column>
      <el-table-column prop="pageAliase" label="别名" width="120">
      </el-table-column>
      <el-table-column prop="pageType" label="页面类型" width="150">
      </el-table-column>
      <el-table-column prop="pageWebPath" label="访问路径" width="250">
      </el-table-column>
      <el-table-column prop="pagePhysicalPath" label="物理路径" width="250">
      </el-table-column>
      <el-table-column prop="dataUrl" label="数据路径" width="250">
      </el-table-column>
      <el-table-column prop="pageCreateTime" label="创建时间" width="180" >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <!--父组件中会传来一个值 slot-scope接收
          page.row代表el-table绑定List生成的该元素对应的的当前行。
          也就是遍历List渲染页面，page就是当前父组件，row代表List所在索引对象。
          page.row.pageId代表当前行索引，在List中的pageId。
        -->
        <template slot-scope="page">
          <el-button @click="handleEdit(page.row.pageId)" type="text" size="small">编辑</el-button>
          <el-button @click="handleDelete(page.row.pageId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页组件
      total: 数据的总条数。
      page-size: 页面上要显示多少条数据。默认10。
        根据以上两条就能计算出分页组件要怎么显示，要显示几个。
      current-page: 当前页面，会决定背景加载哪个按钮。
        因为是响应式所以当data中的page改变时，样式也会跟着改变。
        这里样式改变数据却不会发生改变。所以page改变时需要绑定事件去跟着改变样式和显示内容。
      @current-change: 当前页改变时就会触发,改变当前页会回调函数传入当前页码。
      @size-change: 页码改变会触发，改变页码会回调函数传入当前页显示条数。
      @layout：添加组件到页面。
    -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="params.size"
      :page-sizes="sizes"
      :current-page="params.page"
      @current-change="changePage"
      @size-change="handleSizeChange"
      style="float: right"
      v-show="total">
    </el-pagination>
  </div>
</template>

<script>
  import * as cmsApi from '../api/cms' // 导入cms下的所有导出对象。并且作为cmsApi的属性。
  export default {
    data() {
      return {
        list:[], // 默认没有数据
        total:0, // 默认0
        params:{  // 当前页，和每页显示个数由页面提供。这里配置的是默认的页码和每页显示个数。
          page:3,//页码
          size:10,//每页显示个数
                    // 按条件查询
          siteId: '',
          templateId: '',
          pageAliase:'',
          pageName:'',
          pageType:'',
          dataUrl:''
        },
        sizes:[5, 10, 20, 30, 50], // 页数列表
        loading: false, // 加载
        siteList:[], // 用来初始化下拉框的site列表
        templateList: [], //用来初始化下拉框的template列表
        pageTypeList:[{
          type: '0',
          typeDescription: '静态'
        },{
          type: '1',
          typeDescription: '动态'
        }]
      }
    },
    computed: {
      siteId() {
        return this.params.siteId;
      },
      templateId() {
        return this.params.templateId;
      },
      pageType() {
        return this.params.pageType;
      },
      pageAliase() {
        return this.params.pageAliase;
      },
      pageName() {
        return this.params.pageName
      }
    },
    watch: {
      siteId: function (newSiteId) {
        if (!newSiteId) {
          this.query();
        }
      },
      templateId: function (newTemplateId) {
        if (!newTemplateId) {
          this.query();
        }
      },
      pageType: function(newPageType) {
        if (!newPageType) {
          this.query();
        }
      },
      pageAliase: function (newPageAliase) {
        if (!newPageAliase) {
          this.query();
        }
      },
      pageName: function (newPageName) {
        if (!newPageName) {
          this.query();
        }
      }
    },
    methods:{
      //分页查询, 点击分页的页码后会回调该方法，传入当前页码。
      changePage:function (page) {
          this.params.page = page;
          this.loading = true;
          this.query();
      },
      handleSizeChange:function (size) { //页码改变后会回调该方法，传入当前选中的size。
        this.params.size = size; // 设置当前页的显示条数。改变页面样式和重新根据size去查询。
        this.query();
      },
      //查询
      query:function () { // 根据page和size去查询,将params作为参数按条件查询。
        this.loading = true;
        cmsApi.page_list(this.params.page, this.params.size, this.params).then((res) => {
          this.list = res.queryResult.list;
          this.total = res.queryResult.total;
          this.loading = false;
        });
      }, // 修改后跳转页面
      handleEdit(pageId) {
        // 等同于 router-link:to
        this.$router.push({
          path:'/cms/page/edit/'+pageId,query:{
            page: this.params.page,
            siteId: this.params.siteId,
            pageType: this.params.pageType,
            templateId: this.params.templateId,
            pageAliase: this.params.pageAliase,
            pageName: this.params.pageName
          }
        });
      }, // 删除
      handleDelete(pageId) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cmsApi.page_del(pageId).then(res => {
            console.log(res);
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              // 删除成功刷新页面。
              this.query();
            } else {
              this.$message.error("删除失败！");
            }
          });
        });
      }
    }, // 组件的声明周期钩子方法和组件的其他属性平级。ES6的语法等同于mounted:function (){}
    created() {
      // 通过url中的参数初始化
      // || 的作用，如果||前面那个值为false也就是null 0 "" 等使用||后面的值。
      this.params.page = /*Number.parseInt(this.$route.query.page) || */1;
      this.params.siteId = this.$route.query.siteId || "";
      this.params.templateId = this.$route.query.templateId || "";
      this.params.pageAliase = this.$route.query.pageAliase || "" ;
      this.params.pageName = this.$route.query.pageName || "";
      this.params.pageType = this.$route.query.pageType || "";
    },
    mounted() { // Vue组件实例的声明周期方法，当页面渲染后进行默认的查询。也就是页码1每页显示10条数据。
      this.query();
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

<style>

</style>
