import { buildTree } from "../util.js";
import EventBus from "@/utils/EventBus";
export default {
  name: "CheckedTree",
  props: {
    values: {
      type: Array,
      default: () => []
    },
    render: {
      type: Function
    }
  },
  data() {
    return {
      checkedTree: [],
      checkedNodes: [] // 选中的值
    };
  },
  watch: {
    values: {
      handler(val) {
        if (val && val.length > 0) {
          this.checkedNodes = this.$lodash.cloneDeep(val);
          val.forEach(item => {
            this.$set(item, "checked", true); // 关于传递时，在 beforeDestroy 那作处理
          });
          // 深拷贝
          this.checkedTree = buildTree(this.checkedNodes);
        }
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    // 避免默认的情况下 selectedItems 没有值，出现切换的数据丢失
    const data = this.$refs.tree.getCheckedNodes();
    // 这里需要排除父节点的情况，否则勾选会把父亲以下的子节点都勾选
    const params = data.filter(item => {
      return !item.expand;
    });
    EventBus.$emit("checkedItemUpdate", params);
  },
  methods: {
    handleCheckChange(data) {
      // EventBus.$emit("checkedItemUpdate", data);
      this.$emit("update:values", data);
    }
  },
  render() {
    const { Tree } = this.$options.components;
    return (
      <Tree
        ref="tree"
        data={this.checkedTree}
        render={this.render}
        show-checkbox={true}
        multiple={true}
        on-on-check-change={this.handleCheckChange}
      />
    );
  }
};
