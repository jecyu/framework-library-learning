<!--
 * @Description: 
 * @Author: linjy
 * @Date: 2019-08-21 22:34:13
 * @LastEditors: linjy
 -->
<template>
    <div
        ref="wrapper"
        :class="wrapperClass"
      >
        <div v-if="!isShowSelectedTree">
          <Input search :placeholder="placeholder" @on-search="onQueryChange" v-model="inputValue"/>
          <div :class="[prefixCls + '-normal-tree']" :style="`height: ${height}px;`">
            <Tree ref="tree" :data="stateTree" :render="render" :show-checkbox="multiple" :multiple="multiple"  @on-check-change="handleCheckChange" v-bind="$attrs" ></Tree>
          </div>
        </div>
        <!-- 显示查看已选 -->
        <div v-if="isShowSelectedTree" :class="[prefixCls + '-checked-tree']">
          <CheckedTree :values.sync="values" :render="render"></CheckedTree>
        </div>
      </div>
</template>
<script>
import EventBus from "@/utils/EventBus";
import { debounce, arrUnique } from "@/utils/base.js";
import CheckedTree from "./CheckedTree";
const prefixCls = "NrSearchTree";

export default {
  name: "NrSearchTree",
  components: {
    CheckedTree
  },
  props: {
    height: {
      type: Number
    },
    // 树选项
    options: {
      type: Array,
      default: () => []
    },
    // 是否显示已选择的树状态
    isShowSelectedTree: {
      type: Boolean,
      deafult: false
    },
    // 默认选中的选项
    defaultOptionsProp: {
      type: Array,
      default: () => []
    },
    // 加载中
    isLoading: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否可清空勾选的节点
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: false
    },
    // 占位符
    placeholder: {
      type: String,
      default: ""
    },
    childrenKey: {
      type: String,
      default: "children" // TODO 待更新其他函数用 childrenKey 代替 children
    },
    render: {
      type: Function
    }
  },
  data({ options }) {
    return {
      prefixCls: prefixCls,
      visible: false, // 下拉框可见标识
      values: [], // 传递给 checkedTree 的值
      stateTree: options,
      flatState: [], // 扁平化状态
      queryTreeflatState: [], // 搜索树扁平化状态
      queryTree: [], // 搜索后的树
      isFocused: false,
      query: "", // 用于比对控制 selectHead 组件里的输入值
      inputValue: "",
      selectedItems: [] // 选中的节点
    };
  },
  computed: {
    wrapperClass() {
      return { [`${prefixCls}-multiple`]: this.multiple };
    },
    // 控制下拉框显示
    dropDownVisible() {
      let status = true; // 用于检测是否有值
      const noOptions = !this.stateTree || !this.stateTree.length === 0;
      if (noOptions) {
        status = false;
      }
      return this.visible && status;
    },
    // 搜索找不到值
    showNotFoundLabel() {
      return this.stateTree && this.stateTree.lenght === 0 && !this.isLoading;
    },
    selectionCls() {
      return {
        [`${prefixCls}-selection`]: true,
        [`${prefixCls}-selection-focused`]: this.isFocused
      };
    }
  },
  watch: {
    options: {
      handler() {
        // this.stateTree = this.options;
        this.stateTree = JSON.parse(JSON.stringify(this.options));
        this.checkValueAndUpdate(this.stateTree, true);
        this.flatState = this.compileFlatState(this.stateTree);
        this.reset(); // 重置
      },
      deep: true,
      immediate: true
    },
    // 选中的节点
    selectedItems: {
      handler(val) {
        if (this.isShowSelectedTree) {
          // 显示已选择情况下才执行
          this.$emit("on-check-change", val);
          console.log(val);
        }
      },
      deep: true
    },
    defaultOptionsProp: {
      handler() {
        this.unCheckedAll();
        this.$nextTick(() => {
          this.checkValueAndUpdate(this.stateTree, true);
        });
      },
      deep: true
    },
    // 联动的条件
    isShowSelectedTree(val) {
      if (val) {
        this.handleCheckChange(); // 传递值给 checkedTree
      } else {
        // 执行联动值给原 tree
        // this.unCheckedAll();
        this.$nextTick(() => {
          this.checkValueAndUpdate(this.stateTree, true);
        });
      }
    }
  },
  created() {
    this.flatState = this.compileFlatState(this.stateTree);
  },
  beforeMount() {
    EventBus.$on("checkedItemUpdate", this.handleCheckedTreeUpdate);
  },
  beforeDestroy() {
    EventBus.$off("checkedItemUpdate", this.handleCheckedTreeUpdate);
  },
  methods: {
    handleCheckedTreeUpdate(data) {
      this.selectedItems = data; // 获取 checkedTree 的值
    },
    // 多选勾选
    handleCheckChange(checkedNodes) {
      this.values = [];
      const data = this.$refs.tree.getCheckedAndIndeterminateNodes();
      data.forEach(item => {
        // 判断是否是叶子节点
        // if (!item.expand) {
        // this.values.push(item);
        // }
        // find 带有父子关系的值，传递给 checkedTree
        this.flatState.forEach(node => {
          if (item.nodeKey === node.nodeKey) {
            this.values.push(node);
          }
        });
      });
      if (!this.isShowSelectedTree) {
        console.log(checkedNodes);
        this.$emit("on-check-change", checkedNodes);
      }
    },
    onQueryChange(val) {
      // console.log(val);
      val = val.trim();
      // 防抖
      let debounceSearch = debounce(this.fuzzySearch, 500);
      if (val.length > 0 && val !== this.query) {
        this.visible = true;
        this.query = val;
        // 模糊搜索
        debounceSearch(val);
      } else if (val.length === 0) {
        this.initialTree();
      }
    },
    // 重置
    reset() {
      this.query = "";
      this.values = [];
    },
    initialTree() {
      this.stateTree = this.options;
      this.checkValueAndUpdate(this.stateTree, true); // 刷新值
      // this.flatState = this.compileFlatState(this.stateTree);
    },
    // 模糊搜索
    fuzzySearch(val) {
      const filterNodes = this.flatState.filter(obj =>
        obj.node.title.includes(val)
      );
      // 找到所有节点的父节点和他们的子节点，添加进去
      const processNodes = this.hanndleNodesToTreeNodes(filterNodes);
      this.queryTree = this.buildTree(processNodes);
      this.stateTree = this.buildTree(processNodes);
      this.queryTreeflatState = this.compileFlatState(this.queryTree);
    },
    /**
     * @description: 获取给予一组树节点数组，返回包含它们父子节点的数组
     * @param { Array } filterNodes
     * @return: processNodes
     */
    hanndleNodesToTreeNodes(filterNodes) {
      const parentNodes = [];
      if (filterNodes.length > 0) {
        filterNodes.forEach(node => {
          const nodes = this.getTreeUp(node.nodeKey);
          nodes.forEach(item => {
            if (!parentNodes.includes(item)) {
              parentNodes.push(item);
            }
          });
        });
      }

      // 找到所有节点的子节点
      let childNodes = [];
      filterNodes.forEach(node => {
        const children = node.children;
        if (children) {
          children.forEach(item => {
            const childNode = this.flatState.find(
              treeNode => treeNode.nodeKey === item
            );
            if (childNode) {
              childNodes.push(childNode);
            }
          });
        }
      });
      let data = [...filterNodes, ...parentNodes, ...childNodes];
      // 去重
      data = arrUnique(data, "nodeKey");
      // console.log(data);
      // 处理为渲染要求的树数据
      const processNodes = data.map(obj => {
        const newObj = {};
        newObj.parent = obj.parent !== undefined ? obj.parent : -1;
        return Object.assign(newObj, obj.node);
      });
      return processNodes;
    },
    // 找到子节点上面的所有父节点
    getTreeUp(nodeKey) {
      const parentNodes = [];
      const vm = this;
      function treeUp(nodeKey) {
        const parentKey = vm.flatState[nodeKey].parent;
        if (typeof parentKey == "undefined") return; // 跳出递归
        const parent = vm.flatState[parentKey].node;
        if (parent) {
          parentNodes.push(vm.flatState[parentKey]); // 返回带有 parent 整个对象
        }
        treeUp(parentKey);
      }
      treeUp(nodeKey);
      return parentNodes;
    },
    // 向上更新树
    updateTreeUp(nodeKey, flatState = this.flatState) {
      const parentKey = flatState[nodeKey].parent;
      if (typeof parentKey == "undefined" || this.checkStrictly) return; // 跳出递归
      const node = flatState[nodeKey].node;
      const parent = flatState[parentKey].node;
      if (
        node.checked == parent.checked &&
        node.indeterminate == parent.indeterminate
      )
        return; // no need to update upwards
      if (node.checked == true) {
        this.$set(
          parent,
          "checked",
          parent[this.childrenKey].every(node => node.checked)
        );
        this.$set(parent, "indeterminate", !parent.checked);
      } else {
        this.$set(parent, "checked", false);
        this.$set(
          parent,
          "indeterminate",
          parent[this.childrenKey].some(
            node => node.checked || node.indeterminate
          )
        );
      }
      this.updateTreeUp(parentKey, flatState);
    },
    // 扁平化树
    /**
     * @param {Array} tree
     */
    compileFlatState(tree) {
      let keyCounter = 0;
      let childrenKey = this.childrenKey;
      const flatTree = [];
      // 带有父子关系的扁平化树
      function flattenChildren(node, parent) {
        node.nodeKey = keyCounter++;
        flatTree[node.nodeKey] = { ...node, node: node, nodeKey: node.nodeKey }; // 扁平化
        if (typeof parent != "undefined") {
          flatTree[node.nodeKey].parent = parent.nodeKey;
          flatTree[parent.nodeKey][childrenKey].push(node.nodeKey);
        }

        if (node[childrenKey]) {
          flatTree[node.nodeKey][childrenKey] = []; // 设为空
          node[childrenKey].forEach(child => flattenChildren(child, node)); // 遍历孩子
        }
      }
      tree.forEach(rootNode => {
        flattenChildren(rootNode);
      });
      return flatTree;
    },
    /**
     * 生成树结构
     * @param {Array} tree 一维带有父子关系的树数组
     */
    buildTree(tree) {
      const n = []; // 添加多一个数组，记录父级
      const treeMap = {};
      // 删除 所有 children,以防止多次调用（传入的值带有 children）
      tree.forEach(node => {
        node.children && delete node.children;
      });
      tree.forEach(node => (treeMap[node.nodeKey] = node));
      tree.forEach(node => {
        const parent = treeMap[node.parent];
        // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到它对应的父级中
        if (parent) {
          const children = parent.children || []; // parent.children ，避免相同值
          children.push(node);
          parent.children = children;
        } else {
          // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 n 结果集中，作为顶级
          n.push(node);
        }
      });
      return n;
    },
    // 遍历树
    walkTree(node, callback) {
      if (node === null) {
        return;
      }
      callback(node);
      let children = [];
      if (node.children) {
        children = node.children;
      }
      if (children.length) {
        for (let i = 0; i < children.length; i++) {
          const node = children[i];
          node && this.walkTree(node, callback);
        }
      }
    },
    // 更新指定的树节点
    setTreeNode(treeNode, targetNode) {
      this.walkTree(treeNode, node => {
        if (targetNode.nodeKey === node.nodeKey) {
          this.$set(node, "checked", targetNode.checked);
        }
      });
    },
    /**
     * @param {Array} data 树集合
     * @param { checkDefault } [是否检测匹配上次默认已选]
     * @description 联动更新已选
     */
    checkValueAndUpdate(data, checkDefault = false) {
      data.forEach(tree => {
        this.walkTree(tree, node => {
          if (this.checkIsSelected(node)) {
            this.$set(node, "checked", true);
          } else {
            this.$set(node, "checked", false);
          }
          if (checkDefault) {
            this.checkDefaultSelected(node);
          }
        });
      });
    },
    checkIsSelected(data) {
      const { values } = this;
      let res = false;
      values.some(v => {
        if (v.nodeKey === data.nodeKey) {
          res = true;
          // 停止遍历
          return true;
        }
      });
      return res;
    },
    // 匹配默认选中
    checkDefaultSelected(data) {
      const { defaultOptionsProp } = this;
      defaultOptionsProp.forEach(v => {
        this.walkTree(data, node => {
          if (node.title === v.title) {
            this.$set(node, "checked", true);
          }
        });
      });
      // 更新选择框的值
      // this.$nextTick(() => {
      //   this.values = this.$refs.tree.getCheckedNodes();
      // });
    },
    unCheckedAll() {
      this.values = [];
      this.stateTree.forEach(val => {
        this.walkTree(val, node => {
          this.$set(node, "checked", false);
          this.$set(node, "indeterminate", false);
          // 向上触发它的父节点
          if (this.stateTree && this.stateTree.length > 0) {
            this.updateTreeUp(node.nodeKey, this.flatState);
          } else {
            this.updateTreeUp(node.nodeKey);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.slide-enter-active {
  animation: fadeIn 0.3s slideUpIn;
}
.slide-leave-active {
  animation: fadeIn 0.3s slideUpIn reverse;
}
@keyframes slideUpIn {
  0% {
    opacity: 0;
    transform: scaleY(0.8);
  }
  100% {
    opacity: 1;
    transform: scaleY(0.8);
  }
}
.NrSearchTree {
  display: inline-block;
  width: 100%;
  vertical-align: middle;
  color: #515a6e;
  font-size: 14px;
  line-height: normal;
  &-normal-tree {
    overflow: auto;
  }
  &-multiple &-selection {
    padding: 0 24px 0 4px;
  }
  &-selection {
    position: relative;
    display: block;
    white-space: nowrap;
    outline: none;
    user-select: none;
    cursor: pointer;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dcdee2;
    transition: all 0.2s ease-in-out;
    &-focused {
      border-color: #57a3f3;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    }
    &:hover {
      border-color: #57a3f3;
      outline: 0;
    }
  }
}
</style>
