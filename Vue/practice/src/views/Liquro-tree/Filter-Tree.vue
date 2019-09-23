<template>
  <div class="Ele-Tree">
    <h1>Tree</h1>
    <h2>基本用法</h2>
    <Button @click="fetchTreeData" :loading="loading">请求数据</Button>
    <Button v-if="options.length > 0" @click="renderTree">渲染树</Button>
    <template v-if="treeData.length > 0">
      <Input
        placeholder="Type to filter..."
        v-model="treeFilter"
        class="filter-field"
      ></Input>
      <LiquorTree
        :data="treeData"
        :options="treeOptions"
        :filter="treeFilter"
        @node:selected="onNodeSelected"
      >
      </LiquorTree>
    </template>
  </div>
</template>

<script>
import LiquorTree from "liquor-tree";
import { buildTree } from "@/utils/base.js";
export default {
  name: "Filter-Tree",
  components: {
    LiquorTree
  },
  data() {
    return {
      options: [],
      treeData: [],
      loading: false,
      treeFilter: "",
      // 样例结构
      sampleData: [
        { text: "Item 1" },
        {
          text: "Item 2",
          state: { expanded: true },
          children: [
            { text: "Item 2.1" },
            { text: "Item 2.2" },
            { text: "Item 2.3" }
          ]
        },
        { text: "Item 3", state: { selected: true } },
        { text: "Item 4" }
      ],
      // tree 配置
      treeOptions: {
        checkbox: true,
        filter: {
          // matcher(query, node) {
          //   return node.data.text.includes(query);
          // },
          // exmtyText: "暂无数据",
          showChildren: true
        }
      }
    };
  },
  methods: {
    onNodeSelected(node) {
      console.log(node.text);
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
    // 构建树结构
    buildTree() {
      // 添加 title 值
      const options = this.options.map(val => {
        const obj = {};
        obj.id = val.id;
        obj.pid = val.pid;
        obj.text = val.name;
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
.Ele-Tree {
  width: 100%;
  height: 100%;
}
</style>
