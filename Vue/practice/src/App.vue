<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
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
</style>
