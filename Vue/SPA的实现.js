// 定义Router
class Router {
  constructor() {
    this.routes = {}; //存放路由path及callback
    this.currentUrl = "";

    // 监听路由change调用对应的路由回调
    window.addEventListener("load", this.refresh, false);
    window.addEventListener("hashchange", this.refresh, false);
  }

  route(path, callback) {
    this.routes[path] = callback;
  }

  push(path) {
    this.routes[path] && this.routes[path]();
  }
}

// 使用router
window.miniRouter = new Router();
miniRouter.route("/", () => console.log("page1"));
miniRouter.route("/page2", () => console.log("page2"));

miniRouter.push("/"); //page1
miniRouter.push("/page2"); //page2
