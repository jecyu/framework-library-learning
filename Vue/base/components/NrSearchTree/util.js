/**
 * 生成树结构
 * @param {Array} tree 一维带有父子关系的树数组
 */
export function buildTree(tree) {
  const n = []; // 添加多一个数组，记录父级
  const treeMap = {};
  // 删除 所有 children,以防止多次调用（传入的值带有 children）
  tree.forEach(node => {
    node.children && delete node.children;
  });
  tree.forEach(node => (treeMap[node.nodeKey] = node));
  tree.forEach(node => {
    const parent = treeMap[node.parent];
    // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到它对应的父级中
    if (parent) {
      const children = parent.children || []; // parent.children ，避免相同值
      children.push(node);
      parent.children = children;
    } else {
      // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 n 结果集中，作为顶级
      n.push(node);
    }
  });
  return n;
}

// 向上更新树
export function updateTreeUp(nodeKey, flatState) {
  const parentKey = flatState[nodeKey].parent;
  if (typeof parentKey == "undefined" || this.checkStrictly) return; // 跳出递归
  const node = flatState[nodeKey].node;
  const parent = flatState[parentKey].node;
  if (
    node.checked == parent.checked &&
    node.indeterminate == parent.indeterminate
  )
    return; // no need to update upwards
  if (node.checked == true) {
    this.$set(
      parent,
      "checked",
      parent[this.childrenKey].every(node => node.checked)
    );
    this.$set(parent, "indeterminate", !parent.checked);
  } else {
    this.$set(parent, "checked", false);
    this.$set(
      parent,
      "indeterminate",
      parent[this.childrenKey].some(node => node.checked || node.indeterminate)
    );
  }
  this.updateTreeUp(parentKey, flatState);
}
