class Dep {
  constructor() {
    // 依赖列表
    this.dependencies = new Set();
  }
  // 添加依赖
  addDep(watcher) {
    if (watcher) {
      this.dependencies.push(watcher);
    }
  }
  // 通知所有依赖更新
  notify() {
    this.dependencies.forEach(watcher => {
      watcher.update();
    });
  }
}
