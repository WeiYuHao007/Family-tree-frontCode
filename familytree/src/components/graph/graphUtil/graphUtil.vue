<template>
<div>
  <template v-if="utilIndex === '2-1'">
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
        <el-button @click.native="addNode()" type="primary" round>添加</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template v-if="utilIndex === '2-2'">
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
        <el-button @click.native="addRelationship()" type="primary" round>添加</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template v-if="utilIndex === '3-1'">
    <el-form :inline="true" :model="this.deletingNode" class="cssTreeUtilShowDetail">
      <p>删除节点</p>
      <el-form-item>
        <el-input v-model="deletingNode.name" placeholder="姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.native="deleteNode()" type="primary" round>删除</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template v-if="utilIndex === '3-2'">
    <el-form :inline="true" :model="this.deletingRelationship" class="cssTreeUtilShowDetail">
      <p>删除关系</p>
      <el-form-item>
        <el-input v-model="deletingRelationship.source" placeholder="姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="deletingRelationship.target" placeholder="姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.native="deleteRelationship()" type="primary" round>删除</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template v-if="utilIndex === '5-1'">
    <el-form :inline="true" :model="this.queryShortestpathVO" class="cssTreeUtilShowDetail">
      <p>最短路径选择器</p>
      <el-form-item>
          <el-input v-model="queryShortestpathVO.startPersonName" placeholder="请输入第一个人的姓名" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryShortestpathVO.endPersonName" placeholder="请输入第二个人的性命" max="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.native="findShortestpath()" type="primary" round>查询</el-button>
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
      queryShortestpathVO: {
        startPersonName: '',
        endPersonName: ''
      },
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
      }
    }
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
            this.$alert(response.data.data)
          }
        })
        .catch(response => {})
    },
    deleteNode () {
      this.$axios
        .delete('/tree/' + this.$route.params.treeName + '/node/' + this.deletingNode.name)
        .then(response => {
          if (response.data.code === 200) {
            this.$alert(response.data.data)
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
            this.$alert(response.data.data)
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
            this.$alert(response.data.data)
          }
        })
        .catch(response => {})
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
            nodes = this.loadNode(response, nodes)
            links = this.loadLink(response, links)
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
    loadNode (response, nodes) {
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
    loadLink (response, links) {
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
  justify-content: center;
  align-items: flex-start;
}
</style>
