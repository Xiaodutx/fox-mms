<template>
  <div class="login-container">
    <el-form ref="form" :model="form" label-width="80px" class="login-form" :rules="rules" @keyup.enter.native="submitForm('form')">
      <h2 class="login-title">会员管理系统</h2>
      <el-form-item label="帐号" prop="username">
        <el-input v-model="form.username" placeholder="请输入帐号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {login,getUserInfo} from '@/api/login';
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur'},
          ]
      }
    };
  },

  components: {},

  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('Login',this.form).then(response=>{
              if(response.flag){
                this.$router.push('/')
              }else{
                this.$message({
                  message: response.message,
                  type: 'warning'
                })
              }
            })
          } else {
            this.$message.error('账号或者密码错误');
            return false;
          }
        });
    }
  }
};
</script>

<style scoped>
.login-form {
  width: 350px;
  /* 上下间隙150px, 左右自动 */
  margin: 200px auto;
  /*透明背景色*/
  background-color: rgb(255, 255, 255, 0.8);
  padding: 30px;
  /* 圆角 */
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login.png") no-repeat;
  overflow: hidden;
}
/* 标题 */
.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
}

</style>