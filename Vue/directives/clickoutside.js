Vue.directive("clickoutside", {
  bind(el, binding, vnode) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }
    el._vueClickOutside_ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  unbind(el, binding) {
    document.removeEventListener("click", el._vueClickOutside_);
    delete el._vueClickOutside_;
  }
});
