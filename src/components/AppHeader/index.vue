<template>
  <div class="header">
    <a href="/">
      <img src="@/assets/fox.png" class="logo" />
      <span class="company">会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-s-fold" command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { logOut } from "@/api/login";
import passwordApi from "@/api/password";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      ruleForm: {
        pass: "",
        newPass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
        newPass: [
          { required: true, trigger: "blur", validator: validatePass },
          { min: 8, max: 15, message: "长度在 8 到 15 个字符", trigger: "blur" }
        ],
        checkPass: [
          { required: true, trigger: "blur", validator: validatePass2 }
        ]
      },
      user: this.$store.state.user.user
    };
  },

  components: {},

  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          this.dialogVisible = true;
          this.$nextTick(() => {
            this.$refs["ruleForm"].resetFields();
          });
          break;
        case "b":
          this.handleLogout();
          break;
        default:
          break;
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleLogout() {
      this.$store.dispatch('LogOut').then(response=>{
        if(response.flag){
          this.$router.push('/login');
          this.$message({
            message: response.message,
            type: 'success',
            duration: 1500
          })
        }else{
          this.$message({
            message: resp.message,
            type: 'warning',
            duration: 1500
          })
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          passwordApi
            .checkPwd(this.user.id, this.ruleForm.pass)
            .then(response => {
              const res = response.data;
              if (res.flag) {
                passwordApi
                  .updatePwd(this.user.id, this.ruleForm.newPass)
                  .then(response => {
                    const res2 = response.data;
                    if (res.flag) {
                      this.dialogVisible = false;
                      this.$message({
                        message: res2.message,
                        type: "success"
                      });
                      this.handleLogout();
                    } else {
                      this.$message({
                        message: "密码更新失败",
                        type: "error"
                      });
                    }
                  });
              } else {
                this.$message({
                  message: "原密码不对",
                  type: "error"
                });
              }
            });
          this.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
  width: 25px;
}
.company {
  position: absolute;
  color: white;
}
.el-dropdown {
  float: right;
  color: white;
  right: 20px;
}
</style>