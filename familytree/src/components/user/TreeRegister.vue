<template>
<div class="cssLoginBox">
  <div class="cssLoginPanel">
    <img ale="FamilyTreeSystem" src="@/assets/FTSlogo.png" style="height: 50px; margin:auto 35% 31px;">
    <el-form ref="registerVO" :model="registerVO" label-position="left">
      <el-form-item>
        <el-input type="text" v-model="registerVO.nickname" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="text" v-model="registerVO.phoneNum" placeholder="电话号码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="text" v-model="registerVO.email" placeholder="邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="registerVO.password" placeholder="密码" show-password></el-input>
      </el-form-item>
    </el-form>
    <el-button @click.native="register"
      type="primary"
      plain
      :loading="this.buttonStatus.register"
      style="width: 340px;">注册</el-button>
  </div>
</div>
</template>

<script>
export default {
  name: 'TreeRegister',
  data () {
    return {
      registerVO: {
        nickname: '',
        phoneNum: '',
        email: '',
        password: ''
      },
      buttonStatus: {
        register: false
      }
    }
  },
  methods: {
    register () {
      this.$axios
        .post('/user/', {
          userNickName: this.register.nickname,
          userPhoneNum: this.register.phoneNum,
          userEmail: this.register.email,
          userPassword: this.register.password
        })
        .then(response => {
          if (response.data.code === 200) {
            this.$alert('注册成功。')
            this.$router.push({path: '/login'})
          } else {
            this.$alert(response.data.message)
          }
        })
        .catch(response => {})
    }
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
  margin: 100px auto;
}
.cssLoginPanel{
  max-width: 340px;
  margin: 0px auto;
}
</style>
