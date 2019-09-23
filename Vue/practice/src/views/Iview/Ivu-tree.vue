<template>
  <div class="Atd-Tree">
    <h1>Tree</h1>
    <h2>基本用法</h2>
    <Button @click="fetchTreeData" :loading="loading">请求数据</Button>
    <Button v-if="options.length > 0" @click="renderTree">渲染树</Button>
    <Tree :data="treeData" v-if="treeData.length > 0"></Tree>
  </div>
</template>

<script>
// const treeData = [
// {
//     title: 'parent 1',
//     expand: true,
//     children: [
//         {
//             title: 'parent 1-1',
//             expand: true,
//             children: [
//                 {
//                     title: 'leaf 1-1-1'
//                 },
//                 {
//                     title: 'leaf 1-1-2'
//                 }
//             ]
//         },
// ]
import { buildTree } from "@/utils/base.js";
export default {
  name: "Ivu-Tree",
  data() {
    return {
      options: [],
      treeData: [],
      loading: false
    };
  },
  methods: {
    onSelect(selectedKeys, info) {
      console.log("selected", selectedKeys, info);
    },
    onCheck(checkedKeys, info) {
      console.log("onCheck", checkedKeys, info);
    },
    async fetchTreeData() {
      try {
        this.loading = true;
        const res = await this.$http.get("static/big-tree.json");
        const data = res.data;
        this.options = data.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    buildTree() {
      // 添加 title 值
      const options = this.options.map(val => {
        const obj = {};
        obj.id = val.id;
        obj.pid = val.pid;
        obj.title = val.name;
        return obj;
      });
      this.treeData = buildTree(options, "id", "pid");
    },
    renderTree() {
      this.buildTree();
    }
  }
};
</script>

<style lang="scss">
.Atd-Tree {
  width: 100%;
  height: 100%;
}
</style>
