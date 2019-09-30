<template>
<div class="cssLoginBox">
  <div class="cssLoginPanel">
    <img ale="FamilyTreeSystem" src="@/assets/FTSlogo.png" style="height: 50px; margin:auto 35% 31px;">
    <el-form ref="userVO" :model="userVO" label-position="left" @keyup.enter.native="login">
      <el-form-item>
        <el-input type="text" v-model="userVO.phoneNum" placeholder="电话号码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="userVO.password" placeholder="密码" show-password></el-input>
      </el-form-item>
    </el-form>
    <div style="margin: 0px auto; margin-bottom: 22px;">
      <el-button @click.native="login" type="primary" plain :loading="this.buttonStatus.login" style="width: 340px;">登录</el-button>
    </div>
    <div style="display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center;">
      <a @click="changePassword" style="cursor: pointer">忘记密码？</a>
      <a @click="register" style="cursor: pointer">注册</a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'TreeLogin',
  data () {
    return {
      userVO: {
        phoneNum: '',
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
      if (this.userVO.phoneNum === '') {
        this.$alert('请输入电话号码。')
        return null
      }
      if (this.userVO.password === '') {
        this.$alert('请输入密码。')
        return null
      }
      this.loginButtonStatus = true
      this.$axios
        .post('/user/status/', {
          phoneNum: this.userVO.phoneNum,
          password: this.userVO.password
        })
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.bus.$emit('on-login')
            this.$router.push({path: '/homepage/' + successResponse.data.data})
            this.$alert(successResponse.data.message)
          }
          if (successResponse.data.code !== 200) {
            this.$alert(successResponse.data.message)
          }
        })
        .catch(failResponse => {})
    },
    register () {
      this.loginButtonStatus = true
      this.$router.push({path: '/register'})
    },
    changePassword () {}
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
