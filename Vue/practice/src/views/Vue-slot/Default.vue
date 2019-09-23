<template>
  <div class="default-wrapper">
    <h1>Vue 单个插槽</h1>
    <Child1>
      <div class="tmpl">
        <span>菜单1</span>
        <span>菜单2</span>
        <span>菜单3</span>
        <span>菜单4</span>
      </div>
    </Child1>
  </div>
</template>

<script>
import Child1 from "./Child1.js";
export default {
  name: "Base",
  components: {
    Child1
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
.default-wrapper {
  width: 100%;
  height: 100%;
}
</style>
