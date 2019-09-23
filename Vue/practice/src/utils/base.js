/**
 * 生成树结构
 * @param {Array} tree 一维带有父子关系的树数组
 */
export function buildTree(tree, nodeKey, parentKey) {
  const n = []; // 添加多一个数组，记录父级
  const treeMap = {};
  // 删除 所有 children,以防止多次调用（传入的值带有 children）
  tree.forEach(node => {
    node.children && delete node.children;
  });
  tree.forEach(node => (treeMap[node[nodeKey]] = node));
  tree.forEach(node => {
    const parent = treeMap[node[parentKey]];
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