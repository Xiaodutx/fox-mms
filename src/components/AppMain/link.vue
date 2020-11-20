<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }" class="link">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
       {{ $route.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  methods: {},
};
</script>

<style scoped>
.el-breadcrumb {
  height: 12px;
  padding: 18px;
  border-radius: 4px;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
}
.link {
  border-left: 3px solid #31c17b;
  padding-left: 10px;
}
</style>

