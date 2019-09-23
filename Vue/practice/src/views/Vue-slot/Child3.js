export default {
  name: "Child",
  data() {
    return {
      list: ["js", "java", "c++"]
    }
  },
  render() {
    return (
      <div class="child">
        <h3>这里是子组件</h3>
        {/* <slot /> */}
        {/* 具名插槽 */}
        {this.$scopedSlots.up({
          data: this.list
        })}
      </div>
    );
  }
};

// Template 写法
// Child.vue
//   <template>
//   <div class='wrapper'>
//     <span>I am a component</span>
//     <slot :data='data'></slot>
//   </div>
// </template>

// // main.vue
// <template>
//   <wrapper>
//     <div slot-scope='{ data }'>
//     </div>
//   </wrapper>
// </template>
