const childA = {
  template: `<template class="border">
    <p>foo: {{ foo }}</p>
    <p>childA的$attrs: {{ $attrs }}</p>
  </template>`,
  name: "childA",
  props: {
    foo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  }
};
export default childA;
