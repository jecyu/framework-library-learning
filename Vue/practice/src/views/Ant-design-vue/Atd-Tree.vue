<template>
  <div class="Atd-Tree">
    <h1>Tree</h1>
    <h2>基本用法</h2>
    <Button @click="fetchTreeData" :loading="loading">请求数据</Button>
    <Button v-if="options.length > 0" @click="renderTree">渲染树</Button>
    <a-tree
      checkable
      :treeData="treeData"
      @select="this.onSelect"
      @check="this.onCheck"
    >
      <!-- <span slot="custom" style="color: #1890ff">
        
      </span> -->
      <!-- <template slot="custom" slot-scope="item">
        <span>{{ item.title }}</span>
      </template> -->
    </a-tree>
  </div>
</template>

<script>
// import * as TreeGen from "tree-json-generator";
// 这个插件的缺点是无法自定义生成的节点数量，而且无法更改节点名称，得递归更改。 // 可以先用这个下载，再处理成一维
// const config = {
//   node: { // Node fields, required
//     id: "@id()", // Pipes
//     parent: "@parent()",
//     level: "@level()",
//     name: "@randomName()",
//     child: "@child()"
//   },
//   rootNodesNumber: 2, // Number of root nodes
//   childNodesNumber: [2, 5], // Number of children nodes (from 2 to 5)
//   hasChildRate: 0.4, // Probability of children
//   maxLevel: 10 // Max nesting
// };
// // let tree = TreeGen.generate(config);
// console.log(tree);

// const treeData2 = [
//   {
//     title: 'parent 1',
//     key: '0-0',
//     children: [
//       {
//         title: 'parent 1-0',
//         key: '0-0-0',
//         disabled: true,
//         children: [
//           { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
//           { title: 'leaf', key: '0-0-0-1' }
//         ]
//       },
//       {
//         title: 'parent 1-1',
//         key: '0-0-1',
//         children: [{ key: '0-0-1-0', slots: { title: 'title0010' } }]
//       }
//     ]
//   }
// ]
import { buildTree } from "@/utils/base.js";
export default {
  name: "Atd-Tree",
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
        obj.key = val.id;
        obj.pid = val.pid;
        obj.title = val.name;
        obj.scopedSlots = { icon: "custom" };
        return obj;
      });
      this.treeData = buildTree(options, "key", "pid");
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
