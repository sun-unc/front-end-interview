/**
 * 1、什么是promise A+
 * 2、如何实现一个符合promise A+规范的promise
 */

const SunPromise = (function () {
  const PENDING = "pending";
  const RESOLVED = "resolved";
  const REJECTED = "rejected";

  /**
   * 创建一个微任务
   * @param {Function} task
   */
  function execAsMicroTask(task) {
    if (process && process.nextTick) {
      process.nextTick(task);
    } else if (window && window.MutationObserver) {
      const observer = new MutationObserver(task);
      const el = document.createElement("div");
      observer.observe(el, {
        childList: true,
      });
      el.innerHTML = "模拟触发元素值改变";
    } else {
      setTimeout(task, 0);
    }
  }
  /**
   * 判断是否是符合Promise A+规范
   * @param {any} value
   */
  function isPromise(value) {
    return !!(
      value &&
      typeof value === "object" &&
      typeof value.then === "function"
    );
  }
  class SunPromise {
    /**
     *
     * @param {Function} executor Promise中异步函数的执行器
     */
    constructor(executor) {
      this.status = PENDING;
      this.value = undefined;
      this._callbackQueue = [];
      try {
        executor(this._resolve.bind(this), this._reject.bind(this));
      } catch (error) {
        this.reject(error);
      }
    }
    /**
     * @param {Function} onFulfilled
     * @param {Function} onRejected
     */
    then(onFulfilled, onRejected) {
      return new SunPromise((resolve, reject) => {
        this._pushCallbackQueue(onFulfilled, RESOLVED, resolve, reject);
        this._pushCallbackQueue(onRejected, REJECTED, resolve, reject);
        this._runCallbackQueue(); // 处理当new Promise的时候 直接resolve的情况
      });
    }
    catch() {}

    _resolve(data) {
      this._changeStatus(RESOLVED, data);
    }
    _reject(reason) {
      this._changeStatus(REJECTED, reason);
    }
    /**
     *
     * @param {string} status 状态
     * @param {any} value  resolve/reject的值
     */
    _changeStatus(status, value) {
      if (this.status !== PENDING) {
        return;
      }
      // 处理reject/resolve是一个Promise的情况
      if (isPromise(value)) {
        value.then(this._resolve.bind(this), this._reject.bind(this));
        return;
      }
      this.status = status;
      this.value = value;
      this._runCallbackQueue();
    }
    /**
     * @param {Function} executor  //then方法需要执行的函数
     * @param {Function} status
     * @param {Function} resolve  //成功状态执行函数
     * @param {Function} reject  //失败状态执行函数
     */
    _pushCallbackQueue(executor, status, resolve, reject) {
      this._callbackQueue.push({
        executor,
        status,
        resolve,
        reject,
      });
    }
    /**
     * Executes the callback queue.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    _runCallbackQueue() {
      while (this._callbackQueue.length) {
        const { executor, status, resolve, reject } =
          this._callbackQueue.shift();
        this._runCallbackQueueItem(executor, status, resolve, reject);
      }
    }
    _runCallbackQueueItem(executor, status, resolve, reject) {
      execAsMicroTask(() => {
        if (this.status === status) {
          if (typeof executor !== "function") {
            // 如果不是函数则根据上一个promise执行的结果执行
            this.status === RESOLVED ? resolve(this.value) : reject(this.value);
          }
          try {
            const result = executor(this.value);
            if (isPromise(result)) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        }
      });
    }
  }
  return SunPromise;
})();

const promise = new Promise((resolve, reject) => {
  resolve(1);
});

promise
  .then((data) => {
    // 使用箭头函数
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(2);
      }, 1000);
    });
  })
  .then((data) => {
    console.log(data);
  });
