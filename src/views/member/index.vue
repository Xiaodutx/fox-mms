<template>
  <div>
    <el-form ref="searchMap" :inline="true" :model="searchMap" class="demo-form-inline" status-icon>
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名字"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" clearable>
          <el-option label="现金" value="1"></el-option>
          <el-option label="支付宝" value="2"></el-option>
          <el-option label="微信" value="3"></el-option>
          <el-option label="银行卡" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker type="date" placeholder="出生日期" v-model="searchMap.birthday"></el-date-picker>
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
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model.number="ruleForm.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.birthday"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model.number="ruleForm.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model.number="ruleForm.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="ruleForm.payType" placeholder="支付类型">
            <el-option label="现金" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="微信" value="3"></el-option>
            <el-option label="银行卡" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="ruleForm.id===null?addMember('ruleForm'):updateMember('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="memberList" max-height="500" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="50"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号" width="150"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="80"></el-table-column>
      <el-table-column prop="birthday" label="会员生日" width="120"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="120"></el-table-column>
      <el-table-column prop="integral" label="可用积分" sortable width="110"></el-table-column>
      <el-table-column prop="money" label="开卡金额" sortable width="120"></el-table-column>
      <el-table-column
        prop="payType"
        label="支付类型"
        width="100"
        :filters="[{ text: '现金', value: '1' }, { text: '支付宝', value: '2' },{ text: '微信', value: '3' },{ text: '银行卡', value: '4' }]"
        :filter-method="filterHandler"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">{{scope.row.payType | payMentType}}</template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址"></el-table-column>
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
import memberApi from "@/api/member";
const payMent = [
  { type: "1", name: "现金" },
  { type: "2", name: "支付宝" },
  { type: "3", name: "微信" },
  { type: "4", name: "银行卡" }
];
export default {
  data() {
    return {
      memberList: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      searchMap: {
        cardNum: "",
        name: "",
        payTypy: "",
        birthday: ""
      },
      dialogVisible: false,
      ruleForm: {
        id: null,
        cardNum: null,
        name: null,
        birthday: null,
        phone: null,
        money: null,
        integral: null,
        payType: null,
        address: null
      },
      rules: {
        cardNum: [
          {
            type: "number",
            required: true,
            message: "请输入卡号",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "change" }],
        birthday: [
          {
            required: true,
            message: "请选择出生日期",
            trigger: "change"
          }
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "change" },
          {
            pattern: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "change"
          }
        ],
        money: [
          {
            type: "number",
            required: true,
            message: "请输入开卡金额",
            trigger: "change"
          }
        ],
        integral: [
          {
            type: "number",
            required: true,
            message: "请输入积分",
            trigger: "change"
          }
        ],
        payType: [
          { required: true, message: "请选择支付类型", trigger: "change" }
        ],
        address: [{ required: true, message: "请输入地址", trigger: "change" }]
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
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const res = response.data;
          this.memberList = res.data.rows;
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
    addMember(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.addMember(this.ruleForm).then(response => {
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
      memberApi.getMemberById(id).then(response => {
        const res = response.data;
        if (res.flag) {
          this.ruleForm = res.data;
        }
      });
    },
    updateMember(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.updateMember(this.ruleForm).then(response => {
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
          memberApi.deleteMember(id).then(response => {
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

