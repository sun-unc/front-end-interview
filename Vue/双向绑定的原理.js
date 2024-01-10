/**
 *  一、双向绑定的流程
 * 		1.new Vue()首先执行初始化，对data执行响应处理，这个过程发生在Observe()中
 * 		2.同时对模板执行编译，找到其中动态绑定的数据，从data中获取并初始化视图，这个过程发生Compile中
 * 		3.同时定义一个更新函数和Watcher,将来对应数据变化时Watcher会调用更新函数
 * 		4.由于data的某个key在一个视图中可能出现多次，所以每个key都需要一个管家Dep来管理多个Watcher
 * 		5.将来data中数据一旦发生变化，会首先找到对应的Dep，通知所有Watcher执行更新函数
 */

/**
 * 实现：
 * 1.定义构造函数，对data执行响应化处理
 */
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    //对data做响应式处理
    obersve(this.$data);

    // 代理data到vm上
    proxy(this);

    // 执行编译
    new Compile(options.el, this);
  }
}
/**
 * 2.对data选项执行响应化草操作
 */
function observer(obj) {
  if (typeof obj !== "object" || obj == null) {
    return;
  }
  new Observer(obj);
}

class Observer {
  constructor(value) {
    this.value = value;
    this.walk(value);
  }
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

/**
 * 3.编译Compile
 * 对每个元素节点的指令进行扫描和解析，更具指令模板替换数据，以及绑定相应的更新函数
 */
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    if (this.$el) {
      this.compile(this.$el);
    }
  }
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      // 遍历子元素
      if (this.isElement(node)) {
        //判断是否为节点
        console.log("编译元素" + node.nodeName);
      } else if (this.isInterpolation(node)) {
        console.log("编译插值文本" + node.textContent); // 判断是否为插值文本
      }
      if (node.childNodes && node.childNodes.length > 0) {
        // 判断是否有子元素
        this.compile(node);
      }
    });
  }
  isElement(node) {
    return node.nodeType == 1;
  }
  isInterpolation(node) {
    return node.nodeType == 3 && /\{\{(.)*\}\}/.test(node.textContent);
  }
}

/**
 * 4.依赖收集！！！！！！！！！！
 * 视图中会用到data中某key，这称为依赖。同一个key可以出现多次，每次需要收集出来用一个Watcher来维护他们，此过程称为依赖收集。
 * 多个Watcher需要一个Dep来管理，需要更新时由Dep统一通知
 *
 * 实现思路：
 * 		1、defineReactive时为每一个key创建一个Dep实例
 * 		2、初始化视图时读取某个key， 例如name1， 创建一个watcher1
 * 		3、由于触发name1的getter方法，便将watcher1添加到name1对应的Dep中
 * 		4、当name1更新，setter触发时，便可通过对应Dep通知其管所有Watcher更新
 */

// 负责视图更新
class Watcher {
  constructor(vm, key, updater) {
    this.vm = vm;
    this.key = key;
    this.updaterFn = updater;

    // 创建实例时，把当前实例指定到Dep.target静态属性上
    Dep.target = this;
    // 读一下key，触发get
    vm[key];
    // 置空
    Dep.target = null;
  }

  // 未来执行dom更新函数，由dep调用
  update() {
    this.updaterFn.call(this.vm, this.vm[this.key]);
  }
}

// 声明Dep
class Dep {
  constructor() {
    this.deps = []; // 依赖管理
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}

// 创建watcher时触发getter
class Watcher {
  constructor(vm, key, updateFn) {
    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }
}

// 依赖收集，创建Dep实例
function defineReactive(obj, key, val) {
  this.observe(val);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.addDep(Dep.target); // Dep.target就是Watcher实例
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      dep.notify(); // 通知dep执行更新方法
    },
  });
}
