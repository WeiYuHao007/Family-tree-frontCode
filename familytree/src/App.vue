<template>
<el-container>
  <el-header>
    <tree-header></tree-header>
  </el-header>
  <el-main>
    <router-view/>
  </el-main>
  <el-footer>
    <tree-footer></tree-footer>
  </el-footer>
</el-container>
</template>

<script>
import treeHeader from '@/components/layout/TreeHeader.vue'
import treeFooter from '@/components/layout/TreeFooter.vue'

export default {
  name: 'App',
  components: { treeHeader, treeFooter }
}
</script>

<style>
#app {
  font-family: "Helvetica Neue",Helvetica,
    "PingFang SC","Hiragino Sans GB",
    "Microsoft YaHei","微软雅黑",Arial,sans-serif;
  text-align: center;
  color: rgb(51, 51, 51);
  background: rgb(255, 255, 255);
}
html,body, #app,.el-container{
  padding: 0px;
  margin:  0px;
  height:100%;
}
</style>
