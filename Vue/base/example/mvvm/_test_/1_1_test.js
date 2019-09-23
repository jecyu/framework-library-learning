const Observer = require("../js/observer.js");
var data = { name: "jecyu" };
let observe = new Observer(data);
data.name = "linjy"; // 哈哈哈，监听到值变化了 jecyu --> linjy
