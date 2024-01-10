// 用全局变量存储副作用函数
let activeEffect;
function effect(fn) {
  const effectFn = () => {
    //当 effect 执行时，将其设置为全局的副作用函数
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
  };
  // activeEffect.deps  用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = [];
  // 执行副作用函数
  effectFn();
}

// 通过weakMap来管理依赖，并绑定到每个key上
// 存储副作用函数的🪣
const bucket = new WeakMap();

// 收集依赖
function track(target, key) {
  // 没有activeEffect，直接return
  if (!activeEffect) {
    return;
  }
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // 把当前副作用函数添加到依赖集合deps中
  deps.add(activeEffect);
  // 将其添加到acctiveEffect.deps中
  activeEffect.deps.push(deps);
}

// 触发依赖
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) {
    return;
  }
  const effects = depsMap.get(key);
  effects &&
    effects.forEach((effect) => {
      effect();
    });
}
