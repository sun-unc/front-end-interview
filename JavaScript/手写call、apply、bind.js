// call
function call(target, ...args) {
  // 如果不是函数调用 myCall()，则抛出TypeError
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function`);
  }
  // 如果未提供target，则使用全局对象window
  target = target || window;
  // 将target转换为对应的包装对象，以便使用target调用函数
  target = Object(target);
  // 通过Symbol()创建一个唯一的属性名，以避免覆盖对象的现有属性
  const symbolKey = Symbol();
  target[symbolKey] = this;
  const result = target[symbolKey](...args);
  delete target[symbolKey];
  return result;
}

//apply
function apply(target, args) {
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function`);
  }
  target = target || window;
  target = Object(target);
  const symbolKey = Symbol();
  target[symbolKey] = this;
  const res = target[symbolKey](...args);
  delete target[symbolKey];
  return res;
}

// bind
function bind(target, ...args) {
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function`);
  }
  // 保存this的引用
  const self = this;
  return function (...secArgs) {
    // bind返回的函数是作为构造函数时,this指向实例化对象
    if (this instanceof self) {
      return new self(...args, ...secArgs);
    }
    return self.apply(target, [...args, ...secArgs]);
  };
}
