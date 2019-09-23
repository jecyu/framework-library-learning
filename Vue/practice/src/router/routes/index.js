const routes = [
  {
    path: "/",
    name: "",
    meta: {},
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "@/views/Portal/")
  },
  {
    path: "/vue-slot",
    name: "vue-slot",
    meta: {
      navTitle: "vue-slot"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/Vue-slot/index.vue")
  },
  {
    path: "/ant-design-vue",
    name: "ant-design-vue",
    meta: {
      navTitle: "ant-design-vue"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/Ant-design-vue/index.vue")
  },
  {
    path: "/element",
    name: "element",
    meta: {
      navTitle: "Element-ui"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/Element/index.vue")
  },
  {
    path: "/iview",
    name: "iview",
    meta: {
      navTitle: "iview"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/Iview/index.vue")
  },
  {
    path: "/Liquro-tree",
    name: "Liquro-tree",
    meta: {
      navTitle: "Liquro-tree"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/Liquro-tree/index.vue")
  }
];

export default routes;
