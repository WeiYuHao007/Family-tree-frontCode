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
              <template v-if="this.userNickname !== ''">
                <el-dropdown-item @click.native="turnToHomepage">{{ this.userNickname }}</el-dropdown-item>
                <el-dropdown-item @click.native="showMessagePanel">消息
                  <el-badge :value="messages.number" :max="10"></el-badge>
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
              </template>
              <template v-else>
                <el-dropdown-item @click.native="turnToLogin">登录</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
  <el-dialog title="消息列表" :visible.sync="messageDialogFormVisible" width="45%">
    <el-table
      :data="messages.applications.filter(application => !messages.searchName || application.userNickname.toLowerCase().includes(messages.searchName.toLowerCase()))"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          验证信息：<span>{{ props.row.applicationComment }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="申请图谱"
        prop="genealogyName">
      </el-table-column>
      <el-table-column
        label="申请人"
        prop="userNickname">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="messages.searchName"
            size="mini"
            placeholder="输入关键字搜索申请人"/>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="acceptApplication(scope.row.genealogyName, scope.row.userNickname)">通过</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="refuseApplication(scope.row.genealogyName, scope.row.userNickname)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</div>
</template>
<script>
export default {
  name: 'TreeHeader',
  data () {
    return {
      userNickname: '',
      messageDialogFormVisible: false,
      messages: {
        applications: [],
        searchName: '',
        number: null
      }
    }
  },
  mounted () {
    var _this = this
    this.bus.$on('on-login', function () {
      _this.getNickname()
    })
    this.getNickname()
  },
  methods: {
    logout () {
      this.$axios
        .delete('/user/status/')
        .then(successresponse => {
          if (successresponse.data.code === 200) {
            this.userNickname = ''
            this.messages.number = null
            this.messages.applications = []
            this.messages.searchName = ''
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
        .get('/user/header-info')
        .then(response => {
          if (response.data.code === 200) {
            this.userNickname = response.data.data[0]
            if (response.data.data[1] !== null && response.data.data[1] > 0) {
              this.messageReminding()
              this.messages.number = response.data.data[1]
            }
          }
        })
    },
    messageReminding () {
      this.$notify.info({
        title: '消息提示',
        message: '您有新的消息。',
        offset: 50
      })
    },
    showMessagePanel () {
      this.messageDialogFormVisible = true
      this.$axios
        .get('/user/' + this.userNickname + '/admin-trees/application')
        .then(response => {
          if (response.data.code === 200) {
            if (response.data.data !== null) {
              this.messages.applications = response.data.data
              if (this.messages.applications.length !== 0) {
                this.messages.number = response.data.data.length
              }
            }
          }
        })
        .catch()
    },
    acceptApplication (genealogyName, userNickname) {
      this.$axios
        .patch('/tree/' + genealogyName + '/application/' + userNickname)
        .then(response => {
          if (response.data.code === 200) {
            this.showMessagePanel()
            this.$alert(response.data.message)
          }
        })
        .catch(response => {})
    },
    refuseApplication (genealogyName, userNickname) {
      this.$axios
        .delete('/tree/' + genealogyName + '/application/' + userNickname)
        .then(response => {
          if (response.data.code === 200) {
            this.showMessagePanel()
            this.$alert(response.data.message)
          }
        })
        .catch(response => {})
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
