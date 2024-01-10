/**
 * 一、ES5 function -> ES6 class？
 *   1、ES6中的class不能作为函数执行
 *   2、static静态属性是挂在函数本身，public属性是挂在prototype属性上
 *  
 */

// 禁止直接将类作为函数调用
function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// 创建类的属性
function createClass(Constructor, publicProps, staticProps) {
  if (publicProps) {
    // 全局属性定义在prototype上
    defineProperties(Constructor.prototype, publicProps);
  } else if (staticProps) {
    // 静态属性定义在
    defineProperties(Constructor, staticProps);
  }
}

// 定义属性描述符；static属性的描述符在掉用的时候确定
function defineProperties(Constructor, props) {
  for (let i = 0; i < props.length; i++) {
    const property = props[i];
    property.enumerable = property.enumerable || false;
    property.configurable = true;
    if ("value" in property) {
      property.writable = true;
    }
    Object.defineProperties(Constructor, property);
  }
}

/**
 * 用ES5实现ES6的Class
class Example { 
  constructor(name) { 
    this.name = name;
  }
  init() { 
    const fun = () => { console.log(this.name) }
    fun(); 
  } 
}
const e = new Example('Hello');
e.init();
*/

const Example = (function () {
  function Example(name) {
    classCallCheck(this, Example);
    this.name = name;
  }

  createClass(
    Example,
    [
      {
        key: "init",
        value: function init() {
          var _this = this;
          var fun = function fun() {
            console.log(_this.name);
          };
          fun();
        },
      },
    ],
    []
  );

  return Example;
})();

var e = new Example("Hello");
e.init();
