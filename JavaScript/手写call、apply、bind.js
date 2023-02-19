// call
function call(target, ...args) {
  target = target || window;
  const symbolKey = Symbol();
  target[symbolKey] = this;
  const res = target[symbolKey](...args);
  delete target[symbolKey];
  return res;
}
//apply
function apply(target, args) {
  target = target || window;
  const symbolKey = Symbol();
  target[symbolKey] = this;
  const res = target[symbolKey](...args);
  delete target[symbolKey];
  return res;
}
// bind
function bind(target, ...args) {
  target = target || window;
  const symbolKey = Symbol();
  target[symbolKey] = this;
  return function (...innerArgs) {
    const res = target[symbolKey](...args, ...innerArgs);
    // delete target[symbolKey] 这里不能销毁绑定的函数，否则第二次调用的时候，就会出现问题。
    return res;
  };
}
