<template>
<div>
  <template v-if="utilIndex === '3-1'">
    <el-form :inline="true" :model="this.addingNode" class="cssTreeUtilShowDetail">
      <p>增加节点</p>
      <el-form-item>
          <el-input v-model="addingNode.name" placeholder="姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="addingNode.birthTime" placeholder="出生日期"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="addingNode.deathTime" placeholder="死亡日期"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="addingNode.majorAchievements" placeholder="主要成就"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.native="addNode()" type="primary" plain>添加</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template v-if="utilIndex === '3-2'">
    <el-form :inline="true" :model="this.addingRelationship" class="cssTreeUtilShowDetail">
      <p>增加关系</p>
      <el-form-item>
          <el-input v-model="addingRelationship.source" placeholder="姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
          <el-input v-model="addingRelationship.relationshipName" placeholder="关系"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="addingRelationship.target" placeholder="姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.native="addRelationship()" type="primary" plain>添加</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template v-if="utilIndex === '4-1'">
    <el-form :inline="true" :model="this.deletingNode" class="cssTreeUtilShowDetail">
      <p>删除节点</p>
      <el-form-item>
        <el-input v-model="deletingNode.name" placeholder="姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.native="deleteNode()" type="primary" plain>删除</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template v-if="utilIndex === '4-2'">
    <el-form :inline="true" :model="this.deletingRelationship" class="cssTreeUtilShowDetail">
      <p>删除关系</p>
      <el-form-item>
        <el-input v-model="deletingRelationship.source" placeholder="姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="deletingRelationship.target" placeholder="姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.native="deleteRelationship()" type="primary" plain>删除</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template v-if="utilIndex === '6'">
    <template v-if="editState === false">
      <el-form :inline="true" class="cssTreeUtilShowDetail">
        <p>查询节点信息</p>
        <el-form-item>
          <el-autocomplete
            class="inline-input"
            v-model="queryNodeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入节点名称"></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="getNodeInfo()" type="primary" plain>查询</el-button>
          <el-button @click.native="initializeNodeInfo()" type="primary" plain>清空</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="cssTreeUtilNodeInfoDetail" style="width: 220px;">
        <el-scrollbar style="height: 100%; width: 100%;">
          <p>姓名： {{ this.queryNodeInfo.name }}</p>
          <p>出生日期： {{ this.queryNodeInfo.birthTime }}</p>
          <p>死亡日期： {{ this.queryNodeInfo.deathTime }}</p>
          <p>生评：{{ this.queryNodeInfo.majorAchievements }}</p>
          <el-button @click.native="showEditNodeInfoPanel()" type="primary" plain>修改</el-button>
        </el-scrollbar>
      </div>
    </template>
    <template v-else>
      <el-form ref="queryNodeInfo" :model="this.queryNodeInfo" label-position="left"
          class="cssTreeUtilShowDetail" style="height: 500px; width: 200px">
        <el-scrollbar style="height: 100%; width: 100%;">
          <p>{{ queryNodeInfo.name }}</p>
          <el-form-item label="出生日期:" placeholder="出生日期:">
            <el-input v-model="queryNodeInfo.birthTime"></el-input>
          </el-form-item>
          <el-form-item label="死亡日期:">
            <el-input v-model="queryNodeInfo.deathTime" placeholder="死亡日期:"></el-input>
          </el-form-item>
          <el-form-item label="生评:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              placeholder="请输入生评"
              v-model="queryNodeInfo.majorAchievements"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              maxlength="50"
              show-word-limit
              placeholder="请输入备注"
              v-model="queryNodeInfo.commit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="showEditNodeInfoPanel()" type="primary" plain>取消</el-button>
            <el-button @click.native="editNodeInfo()" type="primary" plain>保存</el-button>
          </el-form-item>
        </el-scrollbar>
      </el-form>
    </template>
  </template>
  <template v-if="utilIndex === '7-1'">
    <el-form :inline="true" :model="this.queryShortestpathVO" class="cssTreeUtilShowDetail">
      <p>最短路径选择器</p>
      <el-form-item>
        <el-input v-model="queryShortestpathVO.startPersonName" placeholder="请输入第一个人的姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryShortestpathVO.endPersonName" placeholder="请输入第二个人的性命" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.native="findShortestpath()" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
  </template>
</div>
</template>
<script>
export default {
  name: 'graphUtil',
  props: ['myChart', 'utilIndex'],
  data () {
    return {
      addingNode: {
        name: '',
        birthTime: '',
        deathTime: '',
        majorAchievements: ''
      },
      deletingNode: {
        name: ''
      },
      addingRelationship: {
        source: '',
        target: '',
        relationshipName: ''
      },
      deletingRelationship: {
        source: '',
        target: ''
      },
      queryNodeName: null,
      editState: false,
      nodesNameList: [],
      timeout: null,
      queryNodeInfo: {
        name: null,
        birthTime: null,
        deathTime: null,
        majorAchievements: null,
        commit: ''
      },
      queryShortestpathVO: {
        startPersonName: '',
        endPersonName: ''
      }
    }
  },
  mounted () {
    this.getNodesNameList()
    var _this = this
    // 点击显示节点信息
    this.bus.$on('on-clickNode', function (clickedNodeName) {
      // 将查询输入框填满
      _this.queryNodeName = clickedNodeName
      _this.$axios
        .get('/tree/' + _this.$route.params.treeName + '/node', {
          params: {
            name: clickedNodeName
          }
        })
        .then(response => {
          if (response.data.code === 200) {
            _this.queryNodeInfo = response.data.data
          }
        })
        .catch()
    })
  },
  methods: {
    addNode () {
      this.$axios
        .post('/tree/' + this.$route.params.treeName + '/node', {
          name: this.addingNode.name,
          birthTime: this.addingNode.birthTime,
          deathTime: this.addingNode.deathTime,
          majorAchievements: this.addingNode.majorAchievements
        })
        .then(response => {
          if (response.data.code === 200) {
            // 清空表单数据
            this.addingNode.name = ''
            this.addingNode.birthTime = ''
            this.addingNode.deathTime = ''
            this.addingNode.majorAchievements = ''
            this.addingNode.commit = ''
            this.$alert(response.data.message)
            this.$emit('handleGetTreeMainNodeData')
          } else {
            this.$alert(response.data.message)
          }
        })
        .catch(response => {})
    },
    deleteNode () {
      this.$axios
        .delete('/tree/' + this.$route.params.treeName + '/node/' + this.deletingNode.name)
        .then(response => {
          if (response.data.code === 200) {
            this.$alert(response.data.message)
            this.$emit('handleGetTreeMainNodeData')
          } else {
            this.$alert(response.data.message)
          }
        })
        .catch(response => {})
    },
    addRelationship () {
      this.$axios
        .post('/tree/' + this.$route.params.treeName + '/relationship', {
          source: this.addingRelationship.source,
          target: this.addingRelationship.target,
          relationshipName: this.addingRelationship.relationshipName
        })
        .then(response => {
          if (response.data.code === 200) {
            this.$alert(response.data.message)
            this.$emit('handleGetTreeMainNodeData')
          } else {
            this.$alert(response.data.message)
          }
        })
        .catch(response => {})
    },
    deleteRelationship () {
      this.$axios
        .delete('/tree/' + this.$route.params.treeName + '/relationship', {
          params: {
            source: this.deletingRelationship.source,
            target: this.deletingRelationship.target
          }
        })
        .then(response => {
          if (response.data.code === 200) {
            this.$alert(response.data.message)
            this.$emit('handleGetTreeMainNodeData')
          } else {
            this.$alert(response.data.message)
          }
        })
        .catch(response => {})
    },
    getNodeInfo () {
      this.$axios
        .get('/tree/' + this.$route.params.treeName + '/node', {
          params: {
            name: this.queryNodeName
          }
        })
        .then(response => {
          if (response.data.code === 200) {
            this.queryNodeInfo = response.data.data
          }
        })
        .catch()
    },
    // 初始化查询信息
    initializeNodeInfo () {
      this.queryNodeName = null
      this.queryNodeInfo.name = null
      this.queryNodeInfo.birthTime = null
      this.queryNodeInfo.deathTime = null
      this.queryNodeInfo.majorAchievements = null
    },
    // 显示修改节点信息面板
    showEditNodeInfoPanel () {
      if (this.queryNodeInfo.name !== null) {
        this.editState = !this.editState
      }
    },
    // 修改节点信息
    editNodeInfo () {
      this.$axios
        .put('/tree/' + this.$route.params.treeName + '/node-info', {
          name: this.queryNodeInfo.name,
          birthTime: this.queryNodeInfo.birthTime,
          deathTime: this.queryNodeInfo.deathTime,
          majorAchievements: this.queryNodeInfo.majorAchievements,
          commit: this.queryNodeInfo.commit
        })
        .then(response => {
          if (response.data.code === 200 || response.data.code === 400) {
            this.editState = false
            this.queryNodeInfo.commit = ''
            this.$alert(response.data.message)
          }
        })
        .catch(response => {})
    },
    // 获取本图谱拥有的所有节点名称
    getNodesNameList () {
      this.$axios
        .get('/tree/' + this.$route.params.treeName + '/nodes')
        .then(response => {
          if (response.data.code === 200) {
            this.nodesNameList = response.data.data
          }
        })
        .catch(response => {})
    },
    querySearchAsync (queryString, cb) {
      var nodesNameListLength = this.nodesNameList.length
      var queryNodesList = []
      for (var i = 0; i < nodesNameListLength; i++) {
        queryNodesList.push(
          {
            'value': this.nodesNameList[i]
          }
        )
      }
      var results = queryString ? queryNodesList.filter(this.createFilter(queryString)) : queryNodesList
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    // 查询过滤器
    createFilter (queryString) {
      return (nodeName) => {
        return (nodeName.value.indexOf(queryString) === 0)
      }
    },
    findShortestpath () {
      // 最短关系请求
      this.$axios
        .get('/tree/' + this.$route.params.treeName + '/node/shortestpath', {
          params: {
            startPersonName: this.queryShortestpathVO.startPersonName,
            endPersonName: this.queryShortestpathVO.endPersonName,
            radius: 10000
          }})
        .then(response => {
          if (response.data.code === 200) {
            this.myChart.hideLoading()
            var nodes = []
            var links = []
            nodes = this.loadNode(response)
            links = this.loadLink(response)
            this.myChart.setOption({
              series: [{
                data: nodes,
                links: links
              }]
            })
          }
          if (response.data.code !== 200) {
            this.$alert(response.data.message)
          }
        })
        .catch(response => {})
    },
    loadNode (response) {
      var nodes = []
      // 将普通节点加载
      var nodesList = response.data.data[0]
      var nodesNum = nodesList.length
      // 如果无数据可加载就返回null
      if (nodesNum === 0) {
        return null
      }
      for (var i = 0; i < nodesNum; i++) {
        var node = {
          name: nodesList[i].name,
          x: Number(nodesList[i].x),
          y: Number(nodesList[i].y)
        }
        nodes.push(node)
      }
      return nodes
    },
    loadLink (response) {
      var links = []
      // 将关系加载
      var linksList = response.data.data[1]
      var linksNum = linksList.length
      for (var j = 0; j < linksNum; j++) {
        links.push({
          source: linksList[j].source,
          target: linksList[j].target,
          label: {
            formatter: linksList[j].relationshipName
          }
        })
      }
      return links
    }
  }
}
</script>
<style scoped>
.cssTreeUtilShowDetail {
  display: flex;
  flex-flow: column nowrap;
  /* 用来定义伸缩项目沿主轴线的对齐方式。*/
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
}
.cssTreeUtilNodeInfoDetail {
  display: flex;
  flex-flow: column nowrap;
  /* 用来定义伸缩项目沿主轴线的对齐方式。*/
  justify-content: center;
  align-items: flex-start;
  height: 230px;
}
</style>
<style>
.el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
