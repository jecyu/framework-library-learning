<template>
  <div class="named-wrapper">
    <h1>Vue 具名插槽</h1>
    <Child2>
      <div class="tmpl" slot="up">
        <span>菜单1</span>
        <span>菜单2</span>
        <span>菜单3</span>
        <span>菜单4</span>
      </div>
    </Child2>
  </div>
</template>

<script>
import Child2 from "./Child2.js";
export default {
  name: "Named",
  components: {
    Child2
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
.named-wrapper {
  width: 100%;
  height: 100%;
}
</style>
