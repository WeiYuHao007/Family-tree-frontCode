<template>
<div class="cssLoginBox">
  <div class="cssLoginPanel">
    <img ale="FamilyTreeSystem" src="@/assets/FTSlogo.png" style="height: 50px; margin:auto 35% 31px;">
    <el-form ref="accountVO" :model="accountVO" label-position="left">
      <el-form-item>
        <el-input type="text" v-model="accountVO.telephoneNumber" placeholder="请输入电话号码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="accountVO.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
    </el-form>
    <el-button @click.native="login" type="primary" round :loading="this.buttonStatus.login">登录</el-button>
    <el-button @click.native="register" type="primary" round :loading="this.buttonStatus.register">注册</el-button>
  </div>
</div>
</template>

<script>
export default {
  name: 'TreeLogin',
  data () {
    return {
      accountVO: {
        telephoneNumber: '',
        password: ''
      },
      buttonStatus: {
        login: false,
        register: false
      }
    }
  },
  methods: {
    login () {
      this.loginButtonStatus = true
      this.$axios
        .post('/account/signIn/', {
          telephoneNumber: this.accountVO.telephoneNumber,
          password: this.accountVO.password
        })
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.bus.$emit('on-login', successResponse.data.data.nickName)
            this.$router.push({path: '/homepage/' + successResponse.data.data.nickName})
            this.$alert(successResponse.data.message)
          }
          if (successResponse.data.code !== 200) {
            this.$alert(successResponse.data.message)
          }
        })
        .catch(failResponse => {})
    }
  },
  mounted () {
    var _this = this
    this.bus.$on('on-turnToHomepage', function (accountNickname) {
      _this.$router.push({path: '/homepage/' + accountNickname})
    })
  }
}
</script>
<style scoped>
.cssLoginBox{
  width: 400px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px
    20px;
  padding: 40px 0px 33px 0px;
  border-radius: 30px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(238, 238, 238);
  margin: 150px auto;
}
.cssLoginPanel{
  max-width: 340px;
  margin: 0px auto;
}
</style>
