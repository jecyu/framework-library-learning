<template>
  <div class="Ele-Tree">
    <h1>Tree</h1>
    <h2>基本用法</h2>
    <Button @click="fetchTreeData" :loading="loading">请求数据</Button>
    <Button v-if="options.length > 0" @click="renderTree">渲染树</Button>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      @node-click="handleNodeClick"
      @check-change="onNodeCheck"
      show-checkbox
      :filter-node-method="filterNode"
    ></el-tree>
  </div>
</template>

<script>
import { generateTreeJson } from "@/utils/generateTreeJson.js";
import { buildTree } from "@/utils/base.js";
export default {
  name: "Ele-Tree",
  data() {
    return {
      options: [],
      treeData: [],
      loading: false,
      filterText: "",
      // 样例结构
      sampleData: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 子字段
      subclass: [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1"
                },
                {
                  title: "leaf 1-2-2"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick() {},
    onNodeCheck(node) {
      console.log(node);
    },
    async fetchTreeData() {
      try {
        this.loading = true;
        // const res = await this.getTreeData();
        const res = await this.$http.get("static/big-tree.json");
        const data = res.data;
        this.options = data.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    // 模拟从服务端获得数据
    getTreeData() {
      return new Promise(resolve => {
        setTimeout(() => {
          const data = generateTreeJson(0, 10);
          resolve(data);
        }, 500);
      });
    },
    buildTree() {
      // 添加 title 值
      const options = this.options.map(val => {
        const obj = {};
        obj.id = val.id;
        obj.pid = val.pid;
        obj.label = val.name;
        // 添加 subclass
        obj.subclass = this.subclass;
        return obj;
      });
      this.treeData = buildTree(options, "id", "pid");
    },
    /**
     * @description: 遍历树
     * @param {Object} node
     * @param {Function} callback
     * @param {Object} parentNode
     * @return: null
     */
    traverseTree(node, callback, parentNode) {
      if (node === null) {
        return;
      }
      callback && callback(node, parentNode);
      if (node.children && node.children.length > 0) {
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
          node && this.traverseTree(children[i], callback, node);
        }
      }
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
