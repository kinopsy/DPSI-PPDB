class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.beforeEach = null;
    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());
  }

  on(path, handler, meta = {}) {
    this.routes[path] = { handler, meta };
    return this;
  }

  navigate(path) {
    window.location.hash = '#' + path;
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.routes[hash];

    if (!route) {
      this.navigate('/');
      return;
    }

    if (this.beforeEach) {
      const allowed = this.beforeEach(hash, route.meta);
      if (!allowed) return;
    }

    this.currentRoute = hash;
    route.handler();
    this.updateActiveLinks(hash);
  }

  updateActiveLinks(path) {
    document.querySelectorAll('[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === path);
    });
  }
}

const router = new Router();
