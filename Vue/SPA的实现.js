/**
 * SPA（Single Page Application）是一种 Web 应用程序的架构风格，其特点是将所有页面都嵌入一个单独的 HTML 页面中，并使用 JavaScript 和 AJAX 技术在客户端动态地更新视图和数据。

相比传统的多页面应用程序（MPA），SPA 的优点在于：

1.更快的加载速度：SPA 只需要在首次加载时下载和渲染一个页面，随后的页面切换只需要更新数据和视图，可以大大减少页面刷新和服务器请求，从而提高了页面加载速度和用户体验。

2.更好的交互体验：SPA 可以实现无需刷新页面就能动态更新数据和视图，用户可以更加流畅地操作和交互。

3.更容易实现前后端分离：SPA 可以通过 RESTful API 接口与后端进行交互，实现前后端分离，让前端开发人员专注于界面和交互的实现，后端开发人员专注于业务逻辑和数据处理。

但是，SPA 也存在一些缺点：

1.首次加载时间长：由于 SPA 需要下载和渲染一个单独的页面，因此首次加载时间可能会比较长，特别是对于较大的应用程序。

2.SEO 不友好：由于 SPA 只有一个 HTML 页面，因此搜索引擎很难获取应用程序中的所有页面和内容，对于需要搜索引擎索引的应用程序来说，这可能会是一个问题。

3.需要处理路由和状态管理：由于 SPA 只有一个页面，因此需要使用前端路由和状态管理库来管理不同页面之间的切换和状态传递，这可能会增加应用程序的复杂性和开发难度。

总之，SPA 是一种现代的 Web 应用程序架构风格，可以提高应用程序的性能和用户体验，但也需要考虑到其缺点和复杂性。
 */
// hash模式
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

// history模式
class Router {
  constructor() {
    this.routes = {};
    this.listerPopstate();
  }

  init(path) {
    history.replaceState({ path }, null, path);
    this.routes[path] && this.routes[path]();
  }

  route(path) {
    this.routes[path] = path;
  }

  push(path) {
    history.pushState({ path }, null, path);
    this.routes[path] && this.routes[path]();
  }

  listerPopstate() {
    window.addEventListener("popstate", (e) => {
      const path = e.state && e.state.path;
      this.routers[path] && this.routers[path]();
    });
  }
}

// 使用
window.miniRouter = new Router();
miniRouter.route("/", () => console.log("page1"));
miniRouter.route("/page2", () => console.log("page2"));

// 跳转
miniRouter.push("/page2"); // page2
