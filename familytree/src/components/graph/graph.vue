<template>
<div class="cssTree">
  <div class="cssTreePanelContainer">
    <div class="cssTreeUtilNavDetail">
      <el-menu :collapse='true' @select="handleSelect" style="border-right: 0px;">
        <el-menu-item index="1">
          <i class="el-icon-refresh" @click="expandTree()"></i>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-view" @click="changeLabel()"></i>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-plus"></i>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1">节点</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="3-2">关系</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-minus"></i>
          </template>
          <el-menu-item-group>
            <el-menu-item index="4-1">节点</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="4-2">关系</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="5">
          <i class="el-icon-chat-dot-round"></i>
        </el-menu-item>
        <el-menu-item index="6">
          <i class="el-icon-search"></i>
        </el-menu-item>
        <el-submenu index="7">
          <template slot="title">
            <i class="el-icon-menu"></i>
          </template>
          <el-menu-item-group>
            <span slot="title">工具</span>
            <el-menu-item index="7-1">最短路径选择器</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="8">
          <i class="el-icon-setting"></i>
        </el-menu-item>
      </el-menu>

    </div>
    <div class="cssTreeShowDetail">
      <el-card id="treeShow" class="cssTreeShowPanel"></el-card>
    </div>
    <div class="cssTreeUtilDetail">
      <el-card class="cssTreeUtilShowPanel">
        <graph-util
          :myChart="this.myChart"
          :utilIndex="this.selectUtilIndex"
          @handleGetTreeMainData="getTreeMainData"></graph-util>
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
      // 选择的工具index
      selectUtilIndex: null,
      // 画板对象
      myChart: null,
      // 画板设置控制
      label: {
        nodeLabel: {
          show: true
        },
        edgeLabel: {
          show: true
        }
      },
      // 图谱初始半径
      radius: 1000,
      maxIterationNum: 2,
      // 图数据
      graphData: {
        nodes: [],
        links: []
      },
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
    this.getTreeMainData()
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
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}'
        },
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
            show: this.label.nodeLabel.show,
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
              show: this.label.edgeLabel.show,
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
          data: this.graphData.nodes,
          links: this.graphData.links
        }]
      }
      this.myChart.setOption(option)
      var _this = this
      this.myChart.on('click', function (params) {
        if (params.componentType === 'series') {
          if (params.seriesType === 'graph') {
            if (params.dataType === 'node') {
              _this.selectUtilIndex = '6'
              _this.bus.$emit('on-clickNode', params.name)
            }
          }
        }
      })
    },
    getTreeMainData () {
      this.$axios
        .get('/tree/' + this.$route.params.treeName + '/tree-main-data', {
          params: {
            center_node: '孙权',
            radius: this.radius
          }
        })
        .then(response => {
          if (response.data.code === 200) {
            this.graphData.nodes = response.data.data[0]
            this.graphData.links = this.loadLink(response)
            this.centerNodes = response.data.data[2]
            this.myChart.setOption({
              series: [{
                data: this.graphData.nodes,
                links: this.graphData.links
              }]
            })
          }
        })
        .catch(response => {})
    },
    expandTree () {
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
    },
    handleSelect (index) {
      if (index === '1' || index === '2') {
      } else {
        this.selectUtilIndex = index
      }
    },
    changeLabel () {
      this.label.nodeLabel.show = !this.label.nodeLabel.show
      this.label.edgeLabel.show = !this.label.edgeLabel.show
      this.myChart.setOption({
        series: [{
          label: {
            show: this.label.nodeLabel.show
          },
          edgeLabel: {
            normal: {
              show: this.label.edgeLabel.show
            }
          }
        }]
      })
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
  height: 100%;
  width: 64px;
}
.cssTreeShowDetail {
  margin: 50px auto 0 auto;
  height: 100%;
}
.cssTreeShowPanel{
  height: 500px;
  width: 800px;
  padding: 0px;
}
.cssTreeUtilDetail {
  margin: 50px 10px 0px 10px;
  width: 246px;
  height: 100%;
}
.cssTreeUtilShowPanel {
  height: 500px;
}
</style>
