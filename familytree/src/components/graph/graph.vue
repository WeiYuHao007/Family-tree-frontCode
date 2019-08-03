<template>
<div class="cssTreePanelPage">
  <el-form class="cssTreeUtil" :inline="true" :model="queryShortestpathVO">
    <el-form-item label="最短路径选择器：">
      <el-input v-model="queryShortestpathVO.startPersonName" placeholder="请输入第一个人的姓名" max="5"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="queryShortestpathVO.endPersonName" placeholder="请输入第二个人的性命" max="5"></el-input></el-form-item>
    <el-form-item>
      <el-button @click.native="findShortestpath" type="primary" round>查询</el-button>
    </el-form-item>
  </el-form>
  <el-button @click="showCenterNode()" type="primary">加载</el-button>
  <div id="treeBox" class="cssTreeShowPanel"></div>
</div>
</template>
<script>
export default{
  name: 'TreeGraph',
  data () {
    return {
      // 画板对象
      myChart: null,
      // 图数据
      graphData: {
        nodes: [],
        links: []
      },
      // 图谱初始半径
      radius: 1000,
      maxIterationNum: 2,
      // 迭代使用的参数,存储中心节点位于图节点数据钟的位置
      centerNodes: [],
      // 最短路径选择器对象
      queryShortestpathVO: {
        startPersonName: '',
        endPersonName: ''
      }
    }
  },
  mounted () {
    this.drawGraph()
    this.showMainTree()
  },
  methods: {
    drawGraph () {
      this.myChart = this.$echarts.init(document.getElementById('treeBox'))
      // 画板配置
      var option = {
        title: {
          text: this.$route.params.treeName
        },
        // 提示框的配置
        tooltip: {},
        // 数据更新动画的时长
        animationDurationUpdate: 1500,
        // 数据更新动画的缓动效果
        animationEasingUpdate: 'quinticInOut',
        series: [{
          // 类型：关系图
          type: 'graph',
          // 图的布局
          layout: 'none',
          // 调节节点的大小
          symbolSize: 25,
          // 是否开启鼠标缩放和平移漫游。默认不启动。如果想要开启缩放或者平移，
          // 可以设置成'scale'或者'move'，设置成true为都开启
          roam: true,
          // 鼠标漫游缩放时节点的相应缩放比例，当设为0时节点不随着鼠标的缩放而缩放
          nodeScaleRatio: 0.4,
          // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
          focusNodeAdjacency: true,
          itemStyle: {
            color: '#1C86EE',
            opacity: 0.9
          },
          lineStyle: {
            curveness: 0.3
          },
          label: {
            show: false,
            fontSize: 15,
            // 文字水平对齐方式，默认自动。
            align: 'center'
          },
          /* 边两端的标记类型，可以是一个数组分别指定两端，也可以是单个统一指定。
            默认不显示标记，常见的可以设置为箭头，如下： */
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            normal: {
              show: false,
              formatter: '',
              align: 'center',
              textStyle: {
                fontSize: 15
              }
            }
          },
          emphasis: {
            label: {
              show: true,
              align: 'center'
            },
            edgeLabel: {
              show: true,
              fontWeight: 'bold',
              align: 'center'
            }
          },
          data: this.nodes,
          links: this.links
        }]
      }
      this.myChart.setOption(option)
    },
    showMainTree () {
      // 获取指定向下渲染的节点并渲染，如果没有的话就使用默认的节点
      var nowCenterNode = {
        name: '孙钟',
        x: 0,
        y: 0
      }
      // 将默认节点加入刚被渲染的中心节点
      this.centerNodes.push(nowCenterNode)
      this.graphData.nodes.push(nowCenterNode)
      this.myChart.setOption({
        series: [{
          data: this.graphData.nodes,
          links: this.graphData.links
        }]
      })
      this.showCenterNode(this.centerNodes, this.radius)
    },
    showCenterNode () {
      let centerNodes = this.centerNodes
      let length = centerNodes.length
      let radius = this.radius
      for (let i = 0; i < length; i++) {
        this.showSons(centerNodes[i], radius)
        this.showWifesAndDaughters(centerNodes[i], radius)
      }
      // 删除上一代中心节点数组,并更新半径
      for (let j = 0; j < length; j++) {
        centerNodes.shift()
      }
      // 将半径更新
      this.radius *= 2
    },
    showSons (node, radius) {
      // 在原渲染基础上，加载指定节点的儿子节点并渲染
      this.$axios
        .post('/tree/' + this.$route.params.treeName + '/' + node.name + '/sons/' + radius + '/', {
          name: node.name,
          x: node.x,
          y: node.y
        })
        .then(response => {
          var beforeLength = this.graphData.nodes.length
          var sons = this.loadNode(response, this.graphData.nodes)
          if (sons !== null) {
            var nowNodes = this.graphData.nodes
            // 取出下一代中心节点
            for (let i = beforeLength; i < nowNodes.length; i++) {
              this.centerNodes.push(nowNodes[i])
            }
            // 将刚被渲染的中心节点更新
            this.myChart.setOption({
              series: [{
                data: sons,
                links: this.loadLink(response, this.graphData.links)
              }]
            })
          }
        })
        .catch(response => {})
    },
    showWifesAndDaughters (node, radius) {
      // 在原渲染基础上，加载指定节点的妻子和女儿节点并渲染
      this.$axios
        .post('/tree/' + this.$route.params.treeName + '/' + node.name + '/wifesAndDaughters/' + radius + '/', {
          name: node.name,
          x: node.x,
          y: node.y
        })
        .then(response => {
          // 使用this.nodes与this.links的原因是在原来的基础上继续渲染
          var nodes = this.loadNode(response, this.graphData.nodes)
          if (nodes != null) {
            this.myChart.setOption({
              series: [{
                data: nodes,
                links: this.loadLink(response, this.graphData.links)
              }]
            })
          }
        })
        .catch(response => {})
    },
    findShortestpath () {
      console.log(this.centerNodes[0])
      console.log(this.graphData.nodes[1])
      // 最短关系请求
      this.$axios
        .get('/tree/' + this.$route.params.treeName + '/shortestpath/', {
          params: {
            startPersonName: this.queryShortestpathVO.startPersonName,
            endPersonName: this.queryShortestpathVO.endPersonName,
            radius: 10000
          }
        })
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
.cssTreePanelPage{
  width: 1000px;
  margin: 50px auto;
}
.cssTreeUtil{
  margin-left: 150px;
}
.cssTreeShowPanel{
  height: 500px;
  width: 800px;
  padding: 0px;
  margin: 0px auto;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 20px;
  border-radius: 15px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(238, 238, 238);
}
</style>
