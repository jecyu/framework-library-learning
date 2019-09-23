class Observer {
  constructor(data) {
    this._data = data;
    this.walk(this._data);
  }
  isObject(obj) {
    return (
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      obj !== null &&
      obj !== undefined
    );
  }
  walk(data) {
    const self = this;
    if (!this.isObject(data)) {
      return;
    }
    // 取出所有属性遍历
    Object.keys(data).forEach(key => {
      self.convert(key, data[key]);
    });
  }
  convert(key, val) {
    this.defineReactive(this._data, key, val);
  }

  // getter-setter
  defineReactive(data, key, value) {
    const self = this;
    let dep = new Dep();
    let internalValue = value;
    this.walk(value); // 监听子属性

    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      get() {
        console.log(`gettting key "${key}" to: ${internalValue}`);
        // 由于需要在闭包内添加 watcher，所以通过 Dep 定义一个全局 target 属性，暂存 watcher，添加完移除
        Dep.target && dep.addDep(Dep.target);
        return internalValue;
      },
      set(newValue) {
        console.log(`setting key "${key}":"${internalValue}" to: ${newValue}`);
        const isChanged = internalValue !== newValue;
        if (!isChanged) {
          return;
        }
        internalValue = newValue;
        self.walk(newValue);
        dep.notify(); // 通知所有订阅者
      }
    });
  }
}

/**
 * 依赖追踪
 * @class Dep
 */
class Dep {
  constructor() {
    // 依赖列表
    this.subscribers = new Set();
  }

  // 添加依赖
  addDep(sub) {
    this.subscribers.push(sub);
  }
  // 通知所有依赖更新
  notify() {
    this.subscribers.forEach(sub => sub.update());
  }
}

// // 导出默认值
// module.exports = Observer;
