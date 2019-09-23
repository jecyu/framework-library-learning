<template>
  <div class="portal">
    <div class="portal-syslist">
      <div
        class="menu-item"
        v-for="(item, index) in oneWeightSystemList"
        :key="index"
        @click="onClick(item)"
      >
        <div class="icon-div">
          <i class="iconfont"></i>
        </div>
        <div class="icon-title">{{ item.meta.navTitle }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Portal",
  data() {
    return {
      systemList: [],
      // systemListWeight: [],
      dropdownIcon: "icon-guanlimokuaishouqi-down"
    };
  },
  created() {},
  computed: {
    oneWeightSystemList() {
      // 根据路由表渲染导航列表
      this.systemList = this.$router.options.routes;
      return this.systemList.filter(item => {
        return item.meta && item.meta.navTitle;
      });
    }
  },
  methods: {
    onClick(item) {
      const { name, meta } = item;
      if (meta && meta.disabled) {
        return;
      }
      this.$router.push({
        name
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.portal {
  width: 100%;
  height: 100%;
  #nav {
    padding: 30px;
    background: rgb(226, 226, 226);
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #52cfea;
      }
    }
  }
  &-syslist {
    padding: 1rem;
    display: flex;
    justify-content: space-around;
    overflow: auto;
    .menu-item {
      width: 15%;
      height: 10rem;
      cursor: pointer;
      text-align: center;
      .icon-div {
        text-align: center;
        width: 6rem;
        height: 6rem;
        margin-left: auto;
        margin-right: auto;
        line-height: 6rem;
        border-radius: 7.29rem;
        margin-bottom: 1rem;
        background-color: #1890ff;
        // i {
        //   @include scw(2.5rem, rgba(255, 255, 255, 1), normal);
        // }
        &.disabled {
          background: #999999;
        }
      }
    }
  }
}
</style>
