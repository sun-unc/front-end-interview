/**
 * 1、创建一个新的空对象，该对象是要实例化的类的实例。
 * 2、将该对象的原型指向要实例化的类的原型，以便该对象可以访问该类的原型中定义的方法和属性。
 * 3、将该对象作为 this 参数调用要实例化的类的构造函数，以便将属性和方法添加到该对象上。
 * 4、如果构造函数返回一个对象，则返回该对象；否则，返回创建的新对象。
 */

// 方式一
function mynew(Func, ...args) {
  // 创建一个新对象，并将新对象的隐式原型指向构造函数的显示原型
  const obj = Object.create(Func.prototype);
  // const obj = {};
  // Object.setPrototypeOf(obj, Func.prototype); //这种方式更改原型也是可以的
  // 将构造函数的this指向新对象
  const result = Func.apply(obj, args);
  return result instanceof Object ? result : obj;
}

// 方式二
function create() {
  const Func = [].shift.call(arguments);
  const obj = Object.create(Func.prototype);
  const result = Func.apply(obj, arguments);
  return result instanceof Object ? result : obj;
}
