<template>
<el-container>
  <el-header>
    <tree-header></tree-header>
  </el-header>
  <el-main style="overflow-x: hidden;">
    <router-view/>
  </el-main>
  <el-footer>
    <tree-footer></tree-footer>
  </el-footer>
</el-container>
</template>

<script>
import treeHeader from '@/components/static/TreeHeader.vue'
import treeFooter from '@/components/static/TreeFooter.vue'

export default {
  name: 'App',
  components: { treeHeader, treeFooter },
  mounted () {
    var _this = this
    this.bus.$on('on-logout', function () {
      _this.$router.push({path: '/login'})
    })
    this.bus.$on('on-turnToLogin', function () {
      _this.$router.push({path: '/login'})
    })
    this.bus.$on('on-turnToHomepage', function (userNickname) {
      _this.$router.push({path: '/homepage/' + userNickname})
    })
  }
}
</script>

<style>
#app {
  font-family: "Helvetica Neue",Helvetica,
    "PingFang SC","Hiragino Sans GB",
    "Microsoft YaHei","微软雅黑",Arial,sans-serif;
  text-align: center;
}
html,body, #app,.el-container{
  padding: 0px;
  margin:  0px;
  height: 100%;
}
</style>
