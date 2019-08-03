<template>
<div class="cssHomepageBox">
  <!-- 族谱选择面板 -->
    <div class="cssTreeChoosePanel">
      <template>
        <el-table
          :data="treeListVO"
          style="width:540px">
        <el-table-column
          prop="index"
          label="#"
          width="180">
        </el-table-column>
        <el-table-column
          prop="treeName"
          label="族谱名称"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
          align="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="enterTree(scope.row.treeName)">
              进入
            </el-button>
          </template>
        </el-table-column>
        </el-table>
      </template>
    </div>
</div>
</template>
<script>
export default {
  name: 'TreeHomepage',
  data () {
    return {
      // 用来存储从后台获取的数据
      treeList: [],
      // 用来展现族谱选择面板的数据
      treeListVO: []
    }
  },
  mounted () {
    this.updateTreeList()
    var _this = this
    this.bus.$on('on-logout', function () {
      _this.$router.push({path: '/login'})
    })
  },
  methods: {
    updateTreeList () {
      this.$axios
        .get('/genealogy/findAll/')
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.treeList = successResponse.data.data
            for (var i = 0; i < this.treeList.length; i++) {
              var tree = {}
              tree.index = i + 1
              tree.treeName = this.treeList[i]
              this.treeListVO.push(tree)
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    enterTree (treeName) {
      this.$router.push({path: '/tree/' + treeName})
    }
  }
}
</script>
<style scoped>
.cssHomepageBox{
  width: 600px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px
    20px;
  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(238, 238, 238);
  margin: 150px auto;
}
.cssTreeChoosePanel{
  margin: 0 20px;
}
</style>
