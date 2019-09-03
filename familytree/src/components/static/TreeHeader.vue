<template>
<div class="cssHeader">
  <div class="cssHeaderContainer">
    <div class="cssHeaderLogo">
      <img  src="@/assets/FTSlogo.png" style="width: auto;height: 60px;">
    </div>
    <div class="cssHeaderNav">
      <div class="cssHeaderNavMenu">
        <el-menu :default-active="this.$route.path" mode="horizontal" router>
          <el-menu-item index="/login">首页</el-menu-item>
          <el-menu-item index="/square">广场</el-menu-item>
          <el-menu-item index="/shoop">商店</el-menu-item>
          <el-menu-item index="/help">帮助</el-menu-item>
        </el-menu>
      </div>
      <div class="cssHeaderNavIcon">
        <div class="cssHeaderVavIconItem">
          <el-dropdown :hide-on-click="true">
            <span class="el-dropdown-link" ref="echarType">
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <template v-if="this.userNickname !== null">
                <el-dropdown-item @click.native="turnToHomepage">{{ this.userNickname }}</el-dropdown-item>
              </template>
              <template v-else>
                <el-dropdown-item @click.native="turnToLogin">登录</el-dropdown-item>
              </template>
              <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'TreeHeader',
  data () {
    return {
      userNickname: null
    }
  },
  mounted () {
    var _this = this
    this.bus.$on('on-login', function (userNickname) {
      _this.userNickname = userNickname
    })
    this.getNickname()
  },
  methods: {
    logout () {
      this.$axios
        .delete('/user/status/')
        .then(successresponse => {
          if (successresponse.data.code === 200) {
            this.userNickname = null
            this.bus.$emit('on-logout')
            this.$alert(successresponse.data.message)
          }
          if (successresponse.data.code === 401) {
            this.$alert(successresponse.data.message)
          }
        })
        .catch(response => {})
    },
    turnToLogin () {
      this.bus.$emit('on-turnToLogin')
    },
    turnToHomepage () {
      if (this.userNickname !== null) {
        this.bus.$emit('on-turnToHomepage', this.userNickname)
      } else {
        this.$alert('请先完成登录。')
      }
    },
    getNickname () {
      this.$axios
        .get('/user/nickname/')
        .then(response => {
          if (response.data.code === 200) {
            this.userNickname = response.data.data
          }
        })
    }
  }
}
</script>
<style scoped>
.cssHeader {
  background-color: #fff;
  color: #fff;
  width: 100%;
  overflow-x: hidden;
}
.cssHeaderContainer {
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  margin: 0px auto;
  height: 100%;
  width: 1140px;
  padding: 0;
  margin-bottom: 1px solid #dcdfe6;
}
.cssHeaderNav {
  display: flex;
  flex-wrap: nowrap;
  -webkit-box-align: center;
  align-items: center;
  height: 100%;
}
.cssHeaderNavMenu {
  height: 100%;
}
.cssHeaderNavIcon {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  width: 100px;
}
</style>
