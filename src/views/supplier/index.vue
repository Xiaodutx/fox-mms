<template>
  <div>
    <el-form ref="searchMap" :inline="true" :model="searchMap" class="demo-form-inline" status-icon>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item prop="linkman">
        <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="showDialog('ruleForm')">新增</el-button>
        <el-button @click="resetForm('searchMap')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="供应商编辑" :visible.sync="dialogVisible" width="35%" :before-close="handleClose">
      <el-form
        status-icon
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model.number="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="ruleForm.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="ruleForm.id===null?addSupplier('ruleForm'):updateSupplier('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="supplierList" max-height="500" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column prop="mobile" label="联系电话"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row.id)" size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination> 
  </div>
</template>

<script>
import supplierApi from "@/api/supplier";
// /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/

export default {
  data() {
    return {
      supplierList: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      },
      dialogVisible: false,
      ruleForm: {
        id: null,
        name: null,
        linkman: null,
        mobile: null,
        remark: null
      },
      rules: {
        linkman: [
          {
            required: true,
            message: "请输入联系人",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "请输入供应商名称", trigger: "change" }],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        remark: [{ required: true, message: "请输入备注", trigger: "change" }],
        
      }
    };
  },
  created() {
    this.fetchData();
  },
  components: {},

  methods: {
    fetchData() {
      // supplierApi.getSupplierList().then(response => {
      //   const res = response.data;
      //   this.supplierList = res.data;
      // });
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const res = response.data;
          this.supplierList = res.data.rows;
          this.total = res.data.total;
        });
    },
    handleClick(s) {
      console.log(s);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addSupplier(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.addSupplier(this.ruleForm).then(response => {
            const res = response.data;
            if (res.flag) {
              this.dialogVisible = false;
              this.$message({
                message: res.message,
                type: "success"
              });
            } else {
              this.$message({
                message: "添加失败",
                type: "error"
              });
            }
          });
        } else {
          this.$message({
            message: "请检查填写信息是否规范",
            type: "error"
          });
          return false;
        }
      });
    },
    handleEdit(id) {
      this.dialogVisible = true;
      supplierApi.getSupplierById(id).then(response => {
        const res = response.data;
        if (res.flag) {
          this.ruleForm = res.data;
        }
      });
    },
    updateSupplier(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.updateSupplier(this.ruleForm).then(response => {
            const res = response.data;
            if (res.flag) {
              this.dialogVisible = false;
              this.$message({
                message: res.message,
                type: "success"
              });
            } else {
              this.$message({
                message: "添加失败",
                type: "error"
              });
            }
          });
        } else {
          this.$message({
            message: "请检查填写信息是否规范",
            type: "error"
          });
          return false;
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确定要删除这条会员信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          supplierApi.deleteSupplier(id).then(response => {
            const res = response.data;
            if (res.flag) {
              this.$message({
                type: "success",
                message: res.message
              });
              this.fetchData();
            } else {
              this.$message({
                type: "error",
                message: "删除失败,请重试"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    showDialog(formName) {
      this.ruleForm.id = null;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    }
  },
  filters: {
    payMentType(type) {
      const obj = payMent.find(obj => obj.type === type);
      return obj ? obj.name : null;
    }
  }
};
</script>

<style scoped>
.el-pagination {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
.el-form {
  margin-top: 20px;
}
</style>