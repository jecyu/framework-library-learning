<template>
  <div class="slot-scoped">
    <h1>Vue 作用域插槽 | 带数据的插槽</h1>
    <Child3>
      <div class="tmpl" slot="up" slot-scope="user">
        {{ user.data }}
      </div>
    </Child3>
  </div>
</template>

<script>
import Child3 from "./Child3.js";
export default {
  name: "Slot-scoped",
  components: {
    Child3
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this);
  },
  methods: {}
};
</script>

<style lang="scss">
.slot-scoped {
  width: 100%;
  height: 100%;
}
</style>
