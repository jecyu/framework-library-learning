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
      checkedTree: []
    };
  },
  watch: {
    values: {
      handler(val) {
        if (val && val.length > 0) {
          // 选中所有的值
          val.forEach(item => {
            this.$set(item, "checked", true);
          });
          // 深拷贝
          this.checkedTree = this.$lodash.cloneDeep(buildTree(val));
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCheckChange(data) {
      EventBus.$emit("checkedItemUpdate", data);
    }
  },
  render() {
    const { Tree } = this.$options.components;
    return (
      <Tree
        data={this.checkedTree}
        render={this.render}
        show-checkbox={true}
        multiple={true}
        on-on-check-change={this.handleCheckChange}
      />
    );
  }
};
