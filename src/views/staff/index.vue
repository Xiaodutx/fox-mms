<template>
  <div>
    <el-form ref="searchMap" :inline="true" :model="searchMap" class="demo-form-inline" status-icon>
      <el-form-item prop="userName">
        <el-input v-model="searchMap.userName" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="showDialog('ruleForm')">新增</el-button>
        <el-button @click="resetForm('searchMap')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="会员编辑" :visible.sync="dialogVisible" width="35%" :before-close="handleClose">
      <el-form
        status-icon
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="ruleForm.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model.number="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model.number="ruleForm.salary"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.entryDate"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="ruleForm.id===null?addStaff('ruleForm'):updateStaff('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="staffList" max-height="500" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="50"></el-table-column>
      <el-table-column prop="username" label="账号" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="age" label="年龄" sortable width="120"></el-table-column>
      <el-table-column prop="mobile" label="手机号码" ></el-table-column>
      <el-table-column prop="salary" label="薪酬" sortable width="160"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间" sortable width="200"></el-table-column>
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
import staffApi from "@/api/staff";

export default {
  data() {
    return {
      staffList: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      searchMap: {
        userName: "",
        name: ""
      },
      dialogVisible: false,
      ruleForm: {
        id: null,
        username: null,
        name: null,
        age: null,
        mobile: null,
        salary: null,
        entryDate: null
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入员工账号",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "请输入员工姓名", trigger: "change" }],
        entryDate: [
          {
            required: true,
            message: "请选择入职时间",
            trigger: "change"
          }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "change" },
          {
            pattern: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "change"
          }
        ],
        salary: [
          {
            type: "number",
            required: true,
            message: "请输入薪资",
            trigger: "change"
          }
        ],
        age: [
          {
            type: "number",
            required: true,
            message: "请输入年龄",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  components: {},
  methods: {
    fetchData() {
      // memberApi.getMemberList().then(response => {
      //   const res = response.data;
      //   this.memberList = res.data;
      // });
      staffApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const res = response.data;
          this.staffList = res.data.rows;
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
    addStaff(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.addStaff(this.ruleForm).then(response => {
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
      staffApi.getStaffById(id).then(response => {
        const res = response.data;
        if (res.flag) {
          this.ruleForm = res.data;
        }
      });
    },
    updateStaff(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.updateStaff(this.ruleForm).then(response => {
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
      }).then(() => {
          staffApi.deleteStaff(id).then(response => {
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

