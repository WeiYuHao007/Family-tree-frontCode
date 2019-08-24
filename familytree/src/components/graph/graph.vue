<template>
<div class="cssTree">
  <div class="cssTreePanelContainer">
    <div class="cssTreeUtilNavDetail">
      <el-menu :collapse='true' @select="handleSelect" style="border-right: 0px;">
        <el-menu-item index="1">
          <i class="el-icon-refresh" @click="showCenterNode()"></i>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-plus"></i>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1">节点</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="2-2">关系</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-minus"></i>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1">节点</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="3-2">关系</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="4">
          <i class="el-icon-chat-dot-round"></i>
        </el-menu-item>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-menu"></i>
          </template>
          <el-menu-item-group>
            <span slot="title">工具</span>
            <el-menu-item index="5-1">最短路径选择器</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="6">
          <i class="el-icon-setting"></i>
        </el-menu-item>
      </el-menu>

    </div>
    <div class="cssTreeShowDetail">
      <div id="treeShow" class="cssTreeShowPanel"></div>
    </div>
    <div class="cssTreeUtilDetail">
      <el-card class="cssTreeUtilShow">
        <graph-util :myChart="this.myChart" :utilIndex="this.selectUtilIndex"></graph-util>
      </el-card>
    </div>
  </div>
</div>
</template>
<script>
import graphUtil from '@/components/graph/graphUtil/graphUtil.vue'

export default{
  name: 'TreeGraph',
  components: {
    graphUtil
  },
  data () {
    return {
      isCollapse: true,
      selectUtilIndex: null,
      // 画板对象
      myChart: null,
      // 画板设置控制
      label: {
        show: false
      },
      edgeLabel: {
        show: false
      },
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
      this.myChart = this.$echarts.init(document.getElementById('treeShow'))
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
            show: this.label.show,
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
              show: this.edgeLabel.show,
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
        this.showWivesAndDaughters(centerNodes[i], radius)
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
        .get('/tree/' + this.$route.params.treeName + '/node/' + node.name + '/sons/', {
          params: {
            name: node.name,
            x: node.x,
            y: node.y,
            radius: radius
          }
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
    showWivesAndDaughters (node, radius) {
      // 在原渲染基础上，加载指定节点的妻子和女儿节点并渲染
      this.$axios
        .get('/tree/' + this.$route.params.treeName + '/node/' + node.name + '/wives-and-daughters/', {
          params: {
            name: node.name,
            x: node.x,
            y: node.y,
            radius: radius
          }
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
    },
    handleSelect (index) {
      this.selectUtilIndex = index
    }
  }
}
</script>
<style scoped>
.cssTree{
  width: 100%;
  margin: 0;
}
.cssTreePanelContainer {
  display: flex;
  flex-flow: row nowrap;
  /* 用来定义伸缩项目沿主轴线的对齐方式。*/
  justify-content: flex-start;
  align-items: flex-start;
  width: 1140px;
  margin: 0 auto;
  margin-top: 60px;
}
.cssTreeUtilNavDetail {
  margin-top: 50px;
  margin-left: 10px;
  width: 64px;
}
.cssTreeShowPanel{
  height: 500px;
  width: 800px;
  padding: 0px;
  margin: 50px auto 0 auto;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 20px;
  border-radius: 15px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(238, 238, 238);
}
.cssTreeUtilDetail {
  margin: 50px 10px 0px 10px;
  width: 246px;
  height: 100%;
}
.cssTreeUtilShow {
  height: 500px;
}
</style>
