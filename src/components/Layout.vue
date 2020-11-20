<template>
  <div>
    <app-header></app-header>
    <app-navbar></app-navbar>
    <app-main></app-main>    
  </div>
</template>

<script>
import AppHeader from './AppHeader'
import AppMain from './AppMain'
import AppNavbar from './AppNavbar'
export default {
  data () {
    return {
    }
  },

  components: {AppHeader,AppMain,AppNavbar},

  methods: {}
}
</script>

<style scoped>
.header{
    line-height: 50px;
    right: 0px;
    background-color: #2d3a4b;
    left: 0px;
    color: white;
    position: absolute;
}
.navbar{
    position: absolute;
    width: 200px;
    bottom: 0px;
    top: 50px;
    background-color: #545c64;
    overflow-y: auto;
}
.main{
    position: absolute;
    left: 200px;
    top: 50px;
    right: 0px;
    bottom: 0px;
    overflow-y: auto;
    padding: 10px;
}
</style>