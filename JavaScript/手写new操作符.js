// 方式一
function mynew(Func, ...args) {
  // 创建一个新对象
  const obj = {};
  // 新对象的隐式原型指向构造函数的显示原型
  obj.__proto__ = Func.Prototype;
  // 将构造函数的this指向新对象
  const result = Func.apply(obj, args);
  return result instanceof Object ? result : obj;
}

// 方式二
function create() {
  const Func = [].shift.call(arguments);
  const obj = Object.create(Func);
  const result = Func.apply(obj, arguments);
  return result instanceof Object ? result : obj;
}
