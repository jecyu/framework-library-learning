<template>
  <Layout :style="{ height: '100%' }">
    <Sider hide-trigger :style="{ background: '#fff' }">
      <Menu
        :style="{ height: '100%', overflow: 'auto' }"
        theme="light"
        width="auto"
        @on-select="menuSelect"
      >
        <MenuItem v-for="item in menuData" :key="item.name" :name="item.name">{{
          item.name
        }}</MenuItem>
      </Menu>
    </Sider>
    <Layout>
      <Content :style="{ padding: '24px', background: '#fff' }">
        <!-- <router-view /> -->
        <component :is="currentComp" class="comp2-viewer" />
      </Content>
    </Layout>
  </Layout>
</template>

<script>
const compMap = {}
export default {
  name: 'comp-demo',
  data: () => ({
    menuData: [],
    currentComp: null
  }),
  created () {
    this.init()
  },
  methods: {
    init () {
      const data = []
      const req = require.context('./', false, /\.vue$/)
      req.keys().forEach(fileName => {
        if (/\/index\.vue$/.test(fileName)) {
          return
        }
        const name = fileName.replace(/^\.\/(.*\/)?/, '').replace(/\.vue$/, '')
        const componentConfig = req(fileName)
        data.push({
          name
        })
        compMap[name] = componentConfig.default || componentConfig
      })
      this.menuData = data
    },
    menuSelect (name) {
      this.currentComp = compMap[name]
    }
  }
}
</script>

<style lang="scss">
.comp2-viewer {
  h1,
  h2,
  h3 {
    margin: 0.67em 0;
  }
}
</style>
