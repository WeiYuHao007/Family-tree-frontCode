<template>
<div class="cssHomepage">
  <div class="cssContainer">
    <div class="cssUserContainer">
      <!-- 用户部分信息显示区域 -->
      <div class="cssUserDetail">
        <img alt="" width="200" height="200" src="https://avatars1.githubusercontent.com/u/49115554?s=460&amp;v=4">
        <h1>
          <span>
            {{ this.$route.params.nickname }}
          </span>
        </h1>
        <div style="padding-bottom: 16px;">
          <el-button type="primary" style="width: 200px;">Edit</el-button>
        </div>
        <div>
          <div>{{ this.userShow.introduction }}</div>
        </div>
      </div>
      <!-- 图谱信息显示区域 -->
      <div class="cssTreeDetail">
        <!-- 图谱主要显示区域 -->
        <div class="cssTreeNavContainer">
          <el-tabs v-model="this.treeActiveTab">
            <el-tab-pane label="关注" name="1">
              <template>
                <div class="cssTreePanel">
                  <el-card class="cssTreePanelItem" v-for="(treeName, index) in this.focusedTreeNameList" :key="index" shadow="hover">
                    <div class="cssTreePanelItemContent">
                      <span> {{ treeName }} </span>
                      <span>
                        <el-button size="mini" @click="showTreeInfo()">详情</el-button>
                        <el-button size="mini" @click="enterTree(treeName)">进入</el-button>
                      </span>
                    </div>
                  </el-card>
                </div>
                <el-divider></el-divider>
                <!-- 图谱事件时间戳 -->
                <div class="cssTreeEventsPanel">
                  <el-timeline class="cssTreeEvents">
                    <el-timeline-item v-for="event in this.treeEvents" :key="event"
                      :timestamp="event.timestamp" placement="top">
                      <el-card>
                        <h4>{{ event.commit }}</h4>
                        <p>{{ event.note }}</p>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </template>
            </el-tab-pane>
            <el-tab-pane label="搜索" name="2">
              <template>
                <el-input v-model="searchedTreeName" @keyup.enter.native="searchTree()" placeholder="请输入查询图谱的名称"></el-input>
                <el-divider></el-divider>
                <div>
                  <div class="cssTreePanel">
                  </div>
                </div>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 好友面板 -->
      <div class="cssFriendDetail">
        谱友
        <p v-for="treeName in this.focusedTreeNameList" :key="treeName">
          <i class="el-icon-caret-right">{{treeName}}</i>
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
        registerTime: ''
      },
      treeActiveTab: '1',
      // 用户关注的所有图谱的列表
      focusedTreeNameList: [],
      // 用来存储图谱的事件
      treeEvents: [
        {
          timestamp: '2018/8/12 20:46',
          commit: '增加了一个节点',
          note: '三国东吴孙氏族谱 管理员：Aaron 提交于 2018/8/12 20:46'
        },
        {
          timestamp: '2018/8/3 20:46',
          commit: '修改了一个节点信息',
          note: '三国东吴孙氏族谱 管理员：Aaron 提交于 2018/8/3 20:46'
        },
        {
          timestamp: '2018/8/1 20:46',
          commit: '删除了一个节点',
          note: '三国东吴孙氏族谱 管理员：Aaron 提交于 2018/8/3 20:46'
        },
        {
          timestamp: '2018/7/311 20:46',
          commit: '删除了一个节点',
          note: '三国东吴孙氏族谱 管理员：Aaron 提交于 2018/8/3 20:46'
        }
      ],
      searchedTreeName: '',
      searchedTreeNameList: []
    }
  },
  mounted () {
    this.updateTreeList()
    // 获取该主页的用户信息
    this.getUserShow()
  },
  methods: {
    updateTreeList () {
      this.$axios
        .get('/trees')
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.focusedTreeNameList = successResponse.data.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    searchTree () {
      console.log('请求')
    },
    getUserShow () {
      this.$axios
        .get('/user/' + this.$route.params.nickname + '/info/', {
          params: {
            // 获取UserShow
            all: false
          }
        })
        .then(response => {
          if (response.data.code === 200) {
            this.userShow = response.data.data
          }
        })
        .catch(response => {})
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
</style>
