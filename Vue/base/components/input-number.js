function isValueNumber(value) {
  return !isNaN(value) && isFinite(value) && Number(value) == value;
}

Vue.component("input-number", {
  template: `
    <div class="input-number">
      <input type="text" :value="currentValue" @change="handleChange">
      <button @click="handleDown" :disabled="currentValue <= this.min">-</button>
      <button @click="handleUp" :disabled="currentValue >= this.max">+</button>
    </div>`,
  props: {
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  watch: {
    currentValue(val) {
      this.$emit("input", val);
      this.$emit("on-change", val); // 用于告知父组件数字输入框的值有所改变
    },
    value(val) {
      this.updateValue(val);
    }
  },
  methods: {
    updateValue(val) {
      val > this.max ? (val = this.max) : null;
      val < this.min ? (val = this.min) : null;
      this.currentValue = val;
    },
    handleDown() {
      if (this.currentValue <= this.min) return;
      this.currentValue -= 1;
    },
    handleUp() {
      if (this.currentValue >= this.max) return;
      this.currentValue += 1;
    },
    handleChange(event) {
      let val = event.target.value.trim();
      const max = this.max;
      const min = this.min;
      if (isValueNumber(val)) {
        val = Number(val);
        this.currentValue = val;

        if (val > max) {
          this.currentValue = max;
        } else if (val < min) {
          this.currentValue = min;
        }
      } else {
        // 输入的不是数字，重置为之前的值
        event.target.value = this.currentValue;
      }
    }
  },
  mounted() {
    this.updateValue(this.value);
  }
});
