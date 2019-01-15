<template>
  <div style="margin: 28px 0 0 0">
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
      <el-form-item label="数据路径" prop="dataUrl">
        <el-input v-model="pageForm.dataUrl" auto-complete="off" ></el-input>
      </el-form-item>

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
      <el-button type="primary" @click="editSubmit" icon="el-icon-circle-check">提交</el-button>
      <el-button type="primary" @click="go_back" icon="el-icon-back">返回</el-button>
    </div>
  </div>
</template>

<script>
  import * as cmsApi from '../api/cms'
  export default {
    data() {
      return {
        pageForm: {
          siteId:'',
          templateId:'',
          pageName: '',
          pageAliase: '',
          pageWebPath: '',
          pageParameter:'',
          pagePhysicalPath:'',
          dataUrl: '',
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
          pageAliase: [
            {required: true, message: '请输入页面别名', trigger: 'blur'}
          ],
          pageWebPath: [
            {required: true, message: '请输入访问路径', trigger: 'blur'}
          ],
          pagePhysicalPath: [
            {required: true, message: '请输入物理路径', trigger: 'blur'}
          ],
          dataUrl: [
            {required: true, message: '请输入数据路径', trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      editSubmit() {
        this.$refs.pageForm.validate((valid) => {
          if (valid) {

            cmsApi.page_edit(this.$route.params.pageId, this.pageForm).then((rep) => {
              this.$confirm('是否要修改?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                if (rep.success) { // 保存成功
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.go_back(); //返回页面
                } else { // 保存失败
                  this.$message({
                    type: 'error',
                    message: '修改失败!'
                  });
                }
              });
            })
          }
        })
      },
      go_back() {
        this.$router.push({path:"/cms/page/list", query: {
            page: this.$route.query.page,
            siteId: this.$route.query.siteId,
            pageType: this.$route.query.pageType,
            templateId: this.$route.query.templateId,
            pageAliase: this.$route.query.pageAliase,
            pageName: this.$route.query.pageName
          }});
      }
    },
    created() {
      cmsApi.site_all().then((res) => {
        this.siteList = res.queryResult.list;
      });

      cmsApi.template_all().then((res) => {
        this.templateList = res.queryResult.list;
      });

      // 回显页面内容
      // restful需要通过this.$route.params来获取
      let pageId = this.$route.params.pageId;
      cmsApi.page_get(pageId).then((res) => {
        this.pageForm = res;
      });

    }
  }
</script>
