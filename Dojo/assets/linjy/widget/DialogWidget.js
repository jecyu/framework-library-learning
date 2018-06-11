define([
  'dojo/_base/declare',
  'dojo/dom-style',
  'dojo/dom-construct',
  'dojo/query',
  'dojo/_base/lang',
  'dojo/on',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/text!./templates/DialogWidget.html',
], function (declare, domStyle, domConstruct, query, lang, on, _WidgetBase, _TemplatedMixin, template) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,

    // 设置 dialog 的 tilte
    title: 'This is the Widget Title',
    _setTitleAttr: { node: 'titleNode', type: 'innerHTML' },

    content: '',
    _setContentAttr: { node: 'containerNode', type: 'innerHTML' },

    // widget 的基础类名
    baseClass: 'dialog',

    // widet 的遮罩层
    maskEle: null,

    // 关闭 widget 时间 
    animateTime: 600,

    // widget 的可见标识
    visiable: false,

    constructor: function (propertiesObject, elementId) {
      lang.mixin(this, propertiesObject, elementId);
    },

    postCreate: function () {
      // 调用父类的 postCreate 函数
      this.inherited(arguments);

      // 动态加载 CSS
      domConstruct.create('link', {
        rel: 'stylesheet',
        href: '../assets/linjy/widget/css/DialogWidget.css'
      }, query('head > title')[0], 'after');

      // 初始化 widget 配置
      this.init();
    },

    startup: function () {
    },

    show: function () {
      this.visiable = true;
      domStyle.set(this.domNode, {
        transform: 'translate(-50%, -50%) scale(1, 1)',
        left: '50%',
        top: '50%'
      });

      // 遮罩层
      domStyle.set(this.maskEle, {
        visibility: 'visible'
      })
    },

    hide: function () {
      var domNode = this.domNode;
      var currentWidget = this;

      this.visiable = false;
      domStyle.set(domNode, {
        transform: 'translate(-50%, -50%) scale(0, 0)',
        left: '50%',
        top: '50%'
      });

      // 遮罩层
      setTimeout(function () {
        domStyle.set(currentWidget.maskEle, {
          visibility: 'hidden'
        });
      }, currentWidget.animateTime);
    },


    init: function () {

      // 定位遮罩层
      this.maskEle = domConstruct.create('div', {
        style: {
          width: window.screen.width + 'px',
          height: window.screen.height + 'px',
          backgroundColor: 'rgba(110, 110, 110, 0.7)',
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          visibility: this.visiable ? 'visible' : 'hidden',
          transition: this.animateTime + 'ms transform'
        }
      }, document.body);

      //获取 widget 的根节点
      var domNode = this.domNode;

      // 定位对话框
      domStyle.set(domNode, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: domNode.clientWidth + 'px',
        transform: 'translate(-50%, -50%) scale(0, 0)',
        transition: this.animateTime + 'ms transform'
      });

      // domNode.parentNode.removeChild(domNode);
      domConstruct.place(domNode, this.maskEle, 'last');

      // 绑定事件
      // 单击弹框外面的遮罩层，关闭弹框 
      var currentWidget = this;
      on(currentWidget.maskEle, 'click', function () {
        currentWidget.hide();
      })

      on(domNode, 'click', function (event) {
        event.stopPropagation();
      });

      this.dragNode(domNode.children[0]);
    },

    /* 
     * 拖动绝对定位的 HTML 元素 
     * @param node 拖拽的元素
     */
    dragNode: function (node) {
      var domNode = this.domNode;
      var currentNode = node;
      var mouse = {
        last: {
          x: 0,
          y: 0
        },
        dis: {
          x: 0,
          y: 0
        }
      };
      domStyle.set(currentNode, {
        cursor: 'move'
      });

      // 拖住元素
      on(currentNode, 'mousedown', function (event) {
        // 获得初始鼠标指针的位置
        mouse.last.x = event.clientX;
        mouse.last.y = event.clientY;

        // 移动元素
        var mousemoveListener = on(document, 'mousemove',    // 拖动元素时处理程序
          function (e) {
            // 计算鼠标指针移动的距离，e.clientX 获得鼠标当前的位置
            mouse.dis.x = e.clientX - mouse.last.x;
            mouse.dis.y = e.clientY - mouse.last.y;
            // 更新鼠标指针的位置
            mouse.last.x = e.clientX;
            mouse.last.y = e.clientY;

            console.log('move');
            // 整个盒子元素的位置：盒子元素相对于parent 不为 static 的偏移量 + 鼠标移动的距离（可负）
            domStyle.set(domNode, {
              left: (domNode.offsetLeft + mouse.dis.x) + 'px',
              top: (domNode.offsetTop + mouse.dis.y) + 'px',
            });
            e.preventDefault();
          }
        );

        // 释放拖拽
        var mouseupListener = on(document, 'mouseup',
          // 拖动结束处理程序
          function upHandler(e) {
            console.log('up');
            // 移除拖拽事件
            mousemoveListener.remove();
            // 防止事件进一步传播
            e.stopPropagation();
          }
        );

        // 阻止默认操作，如选择区域文字
        event.preventDefault();
      });

    },
  });

});