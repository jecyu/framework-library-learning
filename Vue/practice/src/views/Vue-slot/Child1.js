export default {
  name: "Child",
  render() {
    return (
      <div class="child">
        <h3>这里是子组件</h3>
        {/* <slot /> */}
        {this.$slots.default}
      </div>
    );
  }
};

// template 写法
//   <template>
//   <div class='wrapper'>
//     <span>I am a component</span>
//     <slot></slot>
//     <slot name='namedSlot'></slot>
//   </div>
// </template>

// // main.vue
// <template>
//   <wrapper>
//     <div>
//       I am the slot
//     </div>

//     <div slot='namedSlot'>I am the named slot</div>
//   </wrapper>
// </template>
