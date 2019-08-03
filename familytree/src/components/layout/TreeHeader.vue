<template>
<el-row class="cssHeader">
  <el-col :span="2" class="cssHeaderLogo">
    <img  src="@/assets/FTSlogo.png" style="width: auto;height: 60px;">
  </el-col>
  <el-col :span="2.5" class="cssHeaderNavMenu">
    <el-menu :default-active="this.$route.path" mode="horizontal" router>
      <el-menu-item index="/login/">首页</el-menu-item>
    </el-menu>
  </el-col>
  <el-col :span="2" :offset="19" class="cssHeaderNavIcon">
    <el-dropdown :hide-on-click="true">
      <span class="el-dropdown-link" ref="echarType">
        {{ this.accountNickname }} <img src="@/assets/FTSuser.png" style="height:30px;">
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="turnToHomepage">个人主页</el-dropdown-item>
        <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-col>
</el-row>
</template>

<script>
export default {
  name: 'TreeHeader',
  data () {
    return {
      accountNickname: ''
    }
  },
  methods: {
    logout () {
      this.$axios
        .get('/account/logout/')
        .then(successresponse => {
          if (successresponse.data.code === 200) {
            this.accountNickname = ''
            this.bus.$emit('on-logout')
            this.$alert(successresponse.data.message)
          }
          if (successresponse.data.code === 401) {
            this.$alert(successresponse.data.message)
          }
        })
    },
    turnToHomepage () {
      if (this.accountNickname !== '') {
        this.bus.$emit('on-turnToHomepage', this.accountNickname)
      } else {
        this.$alert('请先完成登录。')
      }
    }
  },
  mounted: function () {
    var _this = this
    this.bus.$on('on-login', function (accountNickname) {
      _this.accountNickname = accountNickname
    })
  }
}
</script>
<style scoped>
.el-orw{
  margin: 0 20px;
}
</style>
