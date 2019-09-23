let uid = 0;
class Watcher {
  constructor(viewModel, exp, callback) {
    this.viewModel = viewModel;
    this.id = uid++;
    this.exp = exp;
    this.callback = callback;
    this.oldValue = "";
    this.update();
  }
  get() {
    Dep.target = this;
    let res = this.compute(this.viewModel, this.exp); // 在这里触发属性 getter，从而在 observer 中添加到订阅器
    Dep.target = null;
    return res;
  }
  update() {
    let newValue = this.get();
    if (this.oldValue === newValue) {
      return;
    }
    // callback 里进行Dom 的更新操作
    this.callback(newValue, this.oldValue);
    this.oldValue = newValue;
  }
  compute(viewModel, exp) {
    let res = replaceWith(viewModel, exp);
    return res;
  }
}
