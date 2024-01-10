/**
 * 属性描述符：enumerable writable configurable 访问器：get set
 * enumerable：是否可枚举 默认true
 * writable：是否可修改 默认true
 * configurable：是否可修改属性描述符；如果是false则不能删除属性 默认true
 * 
 * 使用属性描述符的时候，*get* 和 *set* 以及 *value* 和 *writable* 这两组是互斥的，设置了 *get* 和 *set* 就不能设置 *value* 和 *writable*，反之设置了 *value* 和 *writable* 也就不可以设置 *get* 和 *set*。
 *
 * 3种方法精准控制
 * 1. Object.preventExtensions(obj) 阻止为对象添加新的属性  检查函数：Object.isExtensible
 * 2. Object.seal() 阻止对象添加新的属性 同时也无法删除 等同于configurable = false  检查函数：Object.isSealed
 * 3. Object.freeze() 阻止对象添加新的属性 同时也无法删除 修改属性 检查函数：Object.isFrozen
 */
// eg：
// Object.defineProperty(obj, 'name', {enumerable: false, configurable: false, writable: false, value: 'hello'})
var obj = Object.create(Object.prototype, {
  x: {
    // value和get、writable和set不能同时存在
    // value: 1, TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute,
    enumerable: false,
    configurable: true,
    get: function () {
      return this.value;
    },
    set: function (value) {
      this.value = "set" + value;
    },
  },
});

// for (let key in obj) {
//   console.log(key);
// }

// 简写  这里的value可以是任意字段
var obj = {
  get x() {
    return this.value + "get";
  },
  set x(value) {
    this.value = "set" + value;
  },
};
obj.x = 3;
console.log(obj.x);

// 定义一个函数用来把一个对象的属性及属性描述符信息拷贝到另一个对象
function extend(toObj, fromObj) {
  for (var key in fromObj) {
    if (!fromObj.hasOwnProperty(key)) {
      continue;
    }
    Object.defineProperty(
      toObj,
      key,
      Object.getOwnPropertyDescriptor(fromObj, key)
    );
  }
  return toObj;
}
