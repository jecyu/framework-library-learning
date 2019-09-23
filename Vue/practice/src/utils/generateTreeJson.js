// [{
//   "node": {
//     "name": "@randomName()",
//     "age": "@randomInteger(14,99)",
//     "email": "@randomEmail()",
//     "registered": "@randomBoolean(0.79)",
//     "child": "@child()"
//   },
//   "rootNodesNumber": 2,
//   "childNodesNumber": [100, 200],
//   "hasChildRate": 0.4,
//   "maxLevel": 1
// }]
// const generate = function(config) {
//   let tree = [];
// };

// function genChild() {}

// 随机生成一个节点，节点的 id，随机从输入的数里面抽取，如 10000 个节点，父节点 id 也从这里面抽取
// 如：id = random(0, 10) pid = (0, 10), id 必须唯一，父 id 可以重复。
// 思路：先生成一维带有父子关系的节点，再构成树，后面再生成树自定义的树
// 所以需要有个计数，记录当前的id。
// 生成根节点的数量
export function generateTreeJson(min, max) {
  let tree = [];
  let collectId = {}; // 收集id
  while (tree.length <= max) {
    let node = {};
    node.id = random(min, max);
    // 进行计数，对比已有的节点
    if (collectId[node.id]) {
      collectId[node.id] += 1;
    } else {
      collectId[node.id] = 1;
    }
    // 重新生成id
    while (collectId[node.id] > 1) {
      node.id = random(min, max);
      // 进行计数，对比已有的节点
      if (collectId[node.id]) {
        collectId[node.id] += 1;
      } else {
        collectId[node.id] = 1;
      }
    }

    // 进行节点其他属性设
    node.name = tree.length;
    node.pid = random(min, max); // parentId 不能与 id 相等，确保有顶级 id，以及确保所有 pid 都能找到上级
    while (node.pid === node.id) {
      node.pid = random(min, max);
    }
    if (node.id === min) {
      node.pid = -1;
    }
    tree.push(node); // 添加进栈
  }
  return tree;
}

console.log(generateTreeJson(0, 5));

// export function buildTree() {

// }

/**
 * @description: min ≤ r ≤ max
 * @param {Number} min
 * @param {Number} max
 * @return: r
 */
function random(min, max) {
  return Math.round(Math.random() * (max - min)) + min; // round 四舍五入
}
