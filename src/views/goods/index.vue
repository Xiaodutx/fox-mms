<template>
  <div>
    <el-form ref="searchMap" :inline="true" :model="searchMap" class="demo-form-inline" status-icon>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input v-model="searchMap.supplierName" placeholder="选择供应商"></el-input>
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
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="code">
          <el-input v-model="ruleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="ruleForm.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model.number="ruleForm.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model.number="ruleForm.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model.number="ruleForm.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="ruleForm.supplierName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="ruleForm.id===null?addGoods('ruleForm'):updateGoods('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="goodsList" max-height="500" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="code" label="商品编号" width="120"></el-table-column>
      <el-table-column prop="spec" label="商品规格" width="120"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价" sortable width="120"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价" sortable width="110"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量" sortable width="120"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" ></el-table-column>
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
import goodsApi from "@/api/goods";

export default {
  data() {
    return {
      goodsList: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      searchMap: {
        name: "",
        code: "",
        supplierName: ""
      },
      dialogVisible: false,
      ruleForm: {
        id: null,
        name: null,
        code: null,
        spec: null,
        ratailPrice: null,
        purchasePrice: null,
        storageNum: null,
        supplierName: null,
      },
      rules: {
        name: [
          {
            
            required: true,
            message: "请输入商品名称",
            trigger: "change"
          }
        ],
        code: [{ required: true, message: "请输入商品编号", trigger: "change" }],
        spec: [
          {
            required: true,
            message: "请输入商品规格",
            trigger: "change"
          }
        ],
        retailPrice: [
          { type: "number", required: true, message: "请输入零售价", trigger: "change" },         
        ],
        purchasePrice: [
          { type: "number", required: true, message: "请输入进货价", trigger: "change" },         
        ],
        storageNum: [
          { type: "number", required: true, message: "请输入库存数量", trigger: "change" },         
        ],
        supplierName: [
          { required: true, message: "请输入供应商名称", trigger: "change" }
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
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const res = response.data;
          this.goodsList = res.data.rows;
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
    addGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.addGoods(this.ruleForm).then(response => {
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
      goodsApi.getGoodsById(id).then(response => {
        const res = response.data;
        if (res.flag) {
          this.ruleForm = res.data;
        }
      });
    },
    updateGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.updateGoods(this.ruleForm).then(response => {
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
          goodsApi.deleteGoods(id).then(response => {
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

