<template>
<div class="cssTreePanelPage">
  <el-button @click.native="findShortestpath" type="primary" round>查询</el-button>
  <div id="treeBox" class="cssTreeShowPanel"></div>
</div>
</template>
<script>
export default{
  name: 'TreeGraph',
  data () {
    return {
      data: [{name: '孙钟', x: 10, y: 0},
        {name: '孙坚', x: 15, y: 0},
        {name: '孙权', x: 20, y: 0}],
      links: [
        {
          source: '孙钟',
          target: '孙坚',
          label: {
            formatter: '父亲'
          }
        },
        {
          source: '孙坚',
          target: '孙权',
          label: {
            formatter: '父亲'
          }
        }
      ]
    }
  },
  mounted () {
    this.drawGraph()
  },
  methods: {
    drawGraph () {
      // 基于给好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('treeBox'))
      // 绘制图表
      var option = {
        // 提示框的配置
        tooltip: {},
        // 数据更新动画的时长
        animationDurationUpdate: 1500,
        // 数据更新动画的缓动效果
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            // 类型：关系图
            type: 'graph',
            // 图的布局
            layout: 'none',
            // 调节节点的大小
            symbolSize: 50,
            // 是否开启鼠标缩放和平移漫游。默认不启动。如果想要开启缩放或者平移，
            // 可以设置成'scale'或者'move'，设置成true为都开启
            roam: true,
            nodeScaleRatio: 0.6,
            focusNodeAdjacency: true,
            itemStyle: {
              color: '#1C86EE'
            },
            label: {
              show: true
            },
            /* 边两端的标记类型，可以是一个数组分别指定两端，也可以是单个统一指定。
              默认不显示标记，常见的可以设置为箭头，如下： */
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 20
                }
              }
            },
            // 节点
            data: this.data,
            // 关系
            links: this.links
          }
        ]
      }
      myChart.setOption(option)
    },
    findShortestpath () {
      this.$axios
        .get('/tree/三国东吴孙氏族谱/shortestpath/', {
          params: {
            treeName: '三国东吴孙氏族谱',
            startPersonName: '孙钟',
            endPersonName: '孙英'
          }
        })
        .then(response => {
          if (response.data.code === 200) {
            var dataLength = response.data.data[0].length
            var linksLength = response.data.data[1].length
            for (var i = 0; i < dataLength; i++) {
              // 将节点加载进data，并初始化x，y坐标
              var node = {}
              node.name = response.data.data[0][0]
              node.x = i * 50
              node.y = 0
              this.data.push(node)
            }
            for (var j = 0; j < linksLength; j++) {
              // 将关系加载进 links
              var link = {}
              link.source = response.data.data[1][j].source
              link.target = response.data.data[1][j].target
              link.label.formatter = response.data.data[1][j].relationshipName
              this.links.push(link)
            }
          }
        })
        .catch(response => {})
    }
  }
}
</script>
<style scoped>
.cssTreePanelPage{
  width: 1000px;
  margin: 50px auto;
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
