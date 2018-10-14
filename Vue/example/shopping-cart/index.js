"use strict";
var app = new Vue({
  el: "#app",
  data: {
    list: [
      {
        category: "electronics",
        goods: [
          {
            id: 1,
            name: "iPhone 7",
            price: 6188,
            count: 1,
          },
          {
            id: 2,
            name: "iPad Pro",
            price: 5888,
            count: 1,
          },
          {
            id: 3,
            name: "MacBook Pro",
            price: 21488,
            count: 1,
          },
        ],
      },
      {
        category: "fruits",
        goods: [
          {
            id: 1,
            name: "apple",
            price: 3,
            count: 1,
          },
          {
            id: 2,
            name: "banana",
            price: 2,
            count: 1,
          },
          {
            id: 3,
            name: "wallermelon",
            price: 10,
            count: 1,
          },
        ],
      },
      {
        category: "daily",
        goods: [
          {
            id: 1,
            name: "paper",
            price: 3,
            count: 1,
          },
          {
            id: 2,
            name: "shampoo",
            price: 2,
            count: 1,
          },
          {
            id: 3,
            name: "shower",
            price: 10,
            count: 1,
          },
        ],
      },
    ],

    // 被选中的选项
    checkedItems: [],
  },
  computed: {
    // 商品总价
    totalPrice: function() {
      var total = 0;
      for (var i = 0; i < this.checkedItems.length; i++) {
        var item = this.checkedItems[i];
        total += item.price * item.count;
      }
      // 返回带有千分位分隔符的商品总价 （暂时只考虑整数的的情况)
      return total.toString().replace(/\B(?=(\d{3})+$)/g, ",");
    },
    // 商品总数
    goodAmount: function() {
      var amount = 0;
      for (var index in this.list) {
        amount += this.list[index].goods.length;
      }
      return amount;
    },
    // 全选标识符
    isCheckedAll: {
      get: function() {
        // 比较选中的商品以及商品原来的总数
        return this.checkedItems.length === this.goodAmount;
      },
      set: function(value) {},
    },
  },
  methods: {
    // 减少指定商品数量
    handleReduce: function(itemGroupIndex, index) {
      if (this.list[itemGroupIndex][index].count === 1) return;
      this.list[itemGroupIndex].goods[index].count--;
    },
    // 增加指定商品数量
    handleAdd: function(itemGroupIndex, index) {
      this.list[itemGroupIndex].goods[index].count++;
    },
    // 移除指定商品
    handleRemove: function(itemGroupIndex, index) {
      this.list[itemGroupIndex].goods.splice(index, 1);
    },
    // 一、实现是否选中该商品的功能，总价变为只计算选中商品的总价，同时提供一个全选的按钮
    // 1. 复选框选中后，把选中的商品从列表取出来，添加到新的数组中 v-model
    // 2. 总价变为遍历计算新列表的商品
    // 3. 如何获取当前复选框的选中状态：this.checkedItems.length === this.list.length 与 isCheckedAll 连接起来

    // 二、将商品列表 list 改为一个二维数组来实现商品的分类
    // 1. list[{[]}, {[]}, {[]}]
    // 2. 增加、减少商品数量

    // 点击全选方法
    checkboxToggleAll: function() {
      console.log(this.isCheckedAll);
      // 判断当前状态是否已经选中
      if (this.isCheckedAll === true) {
        this.isCheckedAll = false;
        this.checkedItems = [];
      } else {
        this.isCheckedAll = true;
        this.checkedItems = [];
        // 选中全部
        for (var i in this.list) {
          for (var j in this.list[i].goods)
            this.checkedItems.push(this.list[i].goods[j]);
        }
      }
    },
  },
});
