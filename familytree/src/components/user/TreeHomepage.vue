<template>
<div class="cssHomepage">
  <div class="cssContainer">
    <div class="cssUserContainer">
      <!-- 用户部分信息显示区域 -->
      <div class="cssUserDetail">
        <template v-if="!panelVisible.userInfo">
          <el-image
          :src="imageUrl"
          class="avatar"
          fit="fill">
          <div slot="error" class="image-slot">
            <el-image
              src="http://39.97.110.195:80/api/user/avatar/25c58bbf4f7a45b0b9be4cd1ce6c48a2.png"
              class="avatar"
              fit="fill"></el-image>
          </div>
          </el-image>
          <h1>
            <span>
              {{ this.userShow.nickname }}
            </span>
          </h1>
          <div style="padding-bottom: 16px;">
            <el-button @click="editUserInfo" type="primary" style="width: 200px;" plain>Edit</el-button>
          </div>
          <div>
            <div>{{ this.userShow.introduction }}</div>
          </div>
        </template>
        <template v-else>
          <el-upload
            name="avatar"
            class="avatar-uploader"
            :action="''"
            :show-file-list="false"
            :with-credentials="true"
            :before-upload="beforeAvatarUpload"
            :http-request='uploadUserAvatar'>
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div style="padding-bottom: 16px;">
            <el-button @click="editUserInfo" type="primary" style="width: 200px;" plain>Cancel</el-button>
          </div>
          <el-card shadow="hover">
            <el-form ref="userInfo" :model="newUserInfo">
              <el-form-item>
                <el-input
                  type="text"
                  v-model="newUserInfo.nickname"
                  placeholder="昵称">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  type="textarea"
                  placeholder="请输入个人简介"
                  v-model="newUserInfo.introduction"
                  :autosize="{ minRows: 4, maxRows: 5 }"
                  maxlength="50"
                  show-word-limit>
                </el-input>
              </el-form-item>
              <el-form-item>
                <div style="display: flex;flex-flow: column nowrap;justify-content: flex-start;align-items: center;">
                  <el-button @click="submitNewUserInfo" type="success" icon="el-icon-check" circle></el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </template>
      </div>
      <!-- 图谱信息显示区域 -->
      <div class="cssTreeDetail">
        <!-- 图谱主要显示区域 -->
        <div class="cssTreeNavContainer">
          <el-tabs v-model="treeActiveTab" lazy="true">
            <el-tab-pane label="关注" name="1">
              <template>
                <div class="cssTreePanel">
                  <el-card class="cssTreePanelItem" v-for="(treeName, index) in focusedTreeNameList" :key="index" shadow="hover">
                    <div class="cssTreePanelItemContent">
                      <span> {{ treeName }} </span>
                      <span>
                        <el-button size="mini" @click="enterTree(treeName)">进入</el-button>
                      </span>
                    </div>
                  </el-card>
                  <el-tooltip class="item" effect="dark" content="创建图谱" placement="bottom">
                    <el-button
                      @click="showCreateTreePanel()"
                      type="primary"
                      icon="el-icon-circle-plus-outline"
                      size="small"
                      plain style="width: 100%; margin: 5px 0px 10px 0px;">
                    </el-button>
                  </el-tooltip>
                  <el-dialog title="创建图谱" :visible.sync="newTreeDialogFormVisible" width="50%">
                    <el-form ref="newTreeInfo" :model="newTreeInfo" size="medium" style="margin: 0px 10px;">
                      <p>新图谱信息：</p>
                      <el-form-item>
                        <el-input v-model="newTreeInfo.newTreeName" placeholder="请输入图谱名称"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-input v-model="newTreeInfo.newTreeDescription" placeholder="请输入图谱简介"></el-input>
                      </el-form-item>
                      <p>初始人物信息：</p>
                      <el-form-item>
                        <el-input v-model="newTreeInfo.defaultCenterNodeName" placeholder="请输入人物名字"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-input v-model="newTreeInfo.nodeBirthTime" placeholder="请输入人物出生日期"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-input v-model="newTreeInfo.nodeDeathTime" placeholder="请输入人物死亡日期"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-input v-model="newTreeInfo.nodeMajorAchievements" placeholder="请输入人物生平"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="createTree()">立即创建</el-button>
                        <el-button @click="newTreeDialogFormVisible = false">取消</el-button>
                      </el-form-item>
                    </el-form>
                  </el-dialog>
                </div>
                <!-- 图谱事件时间戳 -->
                <div class="cssTreeEventsPanel">
                  <el-timeline class="cssTreeEvents">
                    <el-timeline-item v-for="(event, index) in treeEvents" :key="index"
                      :timestamp="event.updateTime" placement="top">
                      <el-card>
                        <h4>{{ event.updateCommit }}</h4>
                        <p>{{ event.updateRemark }}</p>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </template>
            </el-tab-pane>
            <el-tab-pane label="搜索" name="2">
              <template>
                <el-input v-model="searchTreeKeyword" @keyup.enter.native="searchTrees(searchTreeKeyword, searchTreePageNum, 'query')" placeholder="请输入查询图谱的名称"></el-input>
                <el-collapse style="border: 0px;">
                  <el-collapse-item v-for="(tree, index) in searchedTreeList" :key="index">
                    <template slot="title">
                      {{ tree.name }}
                    </template>
                    <div>图谱id: {{ tree.id }}</div>
                    <div>管理员: {{ tree.admin }}</div>
                    <div>简介: {{ tree.description }}</div>
                    <br />
                    <el-button type="info" icon="el-icon-star-off" circle
                      @click="focusDialogFormVisible = true; focusTreeName = tree.name"></el-button>
                  </el-collapse-item>
                </el-collapse>
                <el-dialog title="关注" :visible.sync="focusDialogFormVisible" width="45%">
                  <el-input v-model="focusTreeComment"
                    type="textarea"
                    :rows="4"
                    maxlength="50"
                    show-word-limit
                    autocomplete="true"
                    placeholder="请输入验证消息"></el-input>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="focusDialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="focusOnTree">确 定</el-button>
                </div>
                </el-dialog>
                <el-divider></el-divider>
                <el-button-group style="display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center;">
                  <el-button @click="handlePrevClick" type="primary" icon="el-icon-arrow-left" size="mini">上一页</el-button>
                  <el-button @click="handleNextClick" type="primary" size="mini">下一页<i class="el-icon-arrow-right"></i></el-button>
                </el-button-group>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 好友面板 -->
      <div class="cssFriendDetail">
        谱友
        <p v-for="treeName in focusedTreeNameList" :key="treeName">
          <i class="el-icon-caret-right">{{ treeName }}</i>
        </p>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'TreeHomepage',
  data () {
    return {
      // 渲染界面的用户对象
      userShow: {
        nickname: '',
        introduction: '',
        avatar: '',
        registerTime: ''
      },
      fileList: [],
      imageUrl: '',
      treeActiveTab: '1',
      // 用户关注的所有图谱的列表
      focusedTreeNameList: [],
      // 用来存储图谱的事件
      treeEvents: [],
      searchTreeKeyword: '',
      searchTreePageNum: 1,
      searchedTreeList: [],
      focusDialogFormVisible: false,
      focusTreeName: '',
      focusTreeComment: '',
      // 创建图谱消息
      newTreeInfo: {
        newTreeName: '',
        newTreeDescription: '',
        defaultCenterNodeName: '',
        nodeBirthTime: '',
        nodeDeathTime: '',
        nodeMajorAchievements: ''
      },
      // 创建图谱面板可见性
      newTreeDialogFormVisible: false,
      newUserInfo: {
        nickname: '',
        introduction: ''
      },
      panelVisible: {
        userInfo: false
      }
    }
  },
  mounted () {
    // 获得关注图谱名称
    this.updatefocusedTreeNameList()
    // 获得关注图谱的事件
    this.getFocusTreeEvents()
    // 获取该主页的用户信息
    this.getUserShow()
  },
  methods: {
    updatefocusedTreeNameList () {
      this.$axios
        .get('/user/' + this.$route.params.nickname + '/trees')
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.focusedTreeNameList = successResponse.data.data
          }
        })
        .catch(response => {})
    },
    getUserShow () {
      this.$axios
        .get('/user/' + this.$route.params.nickname + '/info-show')
        .then(response => {
          if (response.data.code === 200) {
            this.userShow = response.data.data
            console.log()
            if (this.userShow.avatar !== null) {
              this.imageUrl = 'http://39.97.110.195:80/api/user/avatar/' + this.userShow.avatar + '?' + new Date().getTime()
            }
          }
        })
        .catch(response => {})
    },
    editUserInfo () {
      this.panelVisible.userInfo = !this.panelVisible.userInfo
      this.newUserInfo.nickname = this.userShow.nickname
      this.newUserInfo.introduction = this.userShow.introduction
    },
    submitNewUserInfo () {
      if (this.newUserInfo.nickname === '') {
        this.$alert('请输入昵称。')
        return null
      }
      this.$axios
        .post('/user/nickname-introduction', {
          newNickname: this.newUserInfo.nickname,
          newIntroduction: this.newUserInfo.introduction
        })
        .then(response => {
          if (response.data.code === 200) {
            this.userShow.nickname = this.newUserInfo.nickname
            this.userShow.introduction = this.newUserInfo.introduction
            this.panelVisible.userInfo = !this.panelVisible.userInfo
          }
          this.$alert(response.data.message)
        })
        .catch(error => {
          console.log(error)
        })
    },
    uploadUserAvatar (fileObj) {
      let formData = new FormData()
      formData.set('avatar', fileObj.file)
      this.$axios
        .post('/user/avatar', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(response => {
          this.panelVisible.userInfo = !this.panelVisible.userInfo
          this.imageUrl = 'http://39.97.110.195:80/api/user/avatar/' + this.userShow.avatar + '?' + new Date().getTime()
          this.$alert('上传成功。')
        })
        .catch(error => {
          console.log(error)
          this.$alert('上传失败。')
        })
    },
    submitAvatarUpload () {
      this.uploadUserAvatar()
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 获得关注图谱的事件
    getFocusTreeEvents () {
      this.$axios
        .get('/user/' + this.$route.params.nickname + '/focus-trees/update-record')
        .then(response => {
          if (response.data.code === 200) {
            this.treeEvents = response.data.data
          }
        })
        .catch(response => {})
    },
    searchTrees (searchTreeKeyword, searchTreePageNum, state) {
      if (searchTreeKeyword !== '') {
        this.$axios
          .get('trees/info', {
            params: {
              keyword: searchTreeKeyword,
              pageNum: searchTreePageNum
            }
          })
          .then(response => {
            if (response.data.code === 200) {
              var temList = []
              var treeNum = response.data.data.length
              for (var i = 0; i < treeNum; i++) {
                var tree = {
                  id: response.data.data[i].genealogyId,
                  name: response.data.data[i].genealogyName,
                  admin: response.data.data[i].genealogyAdmin,
                  description: response.data.data[i].genealogyDescription
                }
                temList.push(tree)
              }
              this.searchedTreeList = temList
              return true
            } else {
              this.$alert(response.data.message)
              if (state === 'next') {
                this.searchTreePageNum -= 1
              }
              if (state === 'prev') {
                this.searchTreePageNum += 1
              }
            }
          })
          .catch(response => {})
      }
    },
    // 处理上下翻页
    handlePrevClick () {
      this.searchTreePageNum -= 1
      if (this.searchTreePageNum >= 1) {
        this.searchTrees(this.searchTreeKeyword, this.searchTreePageNum, 'prev')
      } else {
        this.searchTreePageNum += 1
        this.$alert('这已经是第一页了。')
      }
    },
    handleNextClick () {
      if (this.searchTreeKeyword !== '') {
        this.searchTreePageNum += 1
        this.searchTrees(this.searchTreeKeyword, this.searchTreePageNum, 'next')
      } else {
        this.$alert('请先输入查询关键词。')
      }
    },
    showCreateTreePanel () {
      this.newTreeDialogFormVisible = true
    },
    createTree () {
      if (this.newTreeInfo.newTreeName === '') {
        console.log('请输入图谱名称。')
      }
      if (this.newTreeInfo.defaultCenterNodeName === '') {
        console.log('请输入人物名称。')
      }
      this.$axios
        .post('/tree', {
          newGenealogyName: this.newTreeInfo.newTreeName,
          newGenealogyDescription: this.newTreeInfo.newTreeDescription,
          defaultCenterNodeName: this.newTreeInfo.defaultCenterNodeName,
          nodeBirthTime: this.newTreeInfo.nodeBirthTime,
          nodeDeathTime: this.newTreeInfo.nodeDeathTime,
          nodeMajorAchievements: this.newTreeInfo.nodeMajorAchievements
        })
        .then(response => {
          if (response.data.code === 200) {
            this.newTreeName = ''
            this.newTreeDescription = ''
            this.defaultCenterNodeName = ''
            this.nodeBirthTime = ''
            this.nodeDeathTime = ''
            this.nodeMajorAchievements = ''
            this.newTreeDialogFormVisible = false
          }
          this.$alert(response.data.message)
        })
        .catch(response => {})
    },
    focusOnTree () {
      this.$axios
        .post('/tree/' + this.focusTreeName + '/application', {
          comment: this.focusTreeComment
        })
        .then(response => {
          if (response.data.code === 200) {
            this.focusDialogFormVisible = false
          }
          this.$alert(response.data.message)
        })
        .catch()
    },
    // 进入指定图谱显示界面
    enterTree (treeName) {
      this.$router.push({path: '/tree/' + treeName})
    }
  }
}
</script>
<style scoped>
.cssHomepage {
  height: 100%;
  width: 100%;
}
.cssUserContainer {
  display: flex;
  flex-flow: row nowrap;
  /* 用来定义伸缩项目沿主轴线的对齐方式。*/
  justify-content: flex-start;
  align-items: flex-start;
  width: 1140px;
  margin: 0 auto;
  margin-top: 10px;
}
.cssUserDetail {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
  width: 200px;
  margin-left: 35px;
}
.cssTreeDetail {
  width: 600px;
  margin-left: 50px;
  margin-right: 50px;
}
.cssTreePanel {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 5px;
}
.cssTreePanelItem {
  margin: 5px 0px;
  height: 70px;
  width: 100%;
}
.cssTreePanelItemContent {
  margin: 0px;
  padding: 0px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}
.cssTreeEvents {
  margin: 0px;
  padding: 5px;
}
.cssTreeQueryHeaderPanel {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.cssFriendDetail {
  border: 1px;
  margin-right: 35px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 11px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 11px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-bottom: 11px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
</style>
