class Router {
	constructor(options) {
		const settings = this._getSettings(options);
		
		this.notFoundHandler = settings.page404;
		this.mode = (!window.history || !window.history.pushState) ? "hash" : settings.mode;
		this.root = settings.root === "/" ? "/" : "/" + this._trimSlashes(settings.root) + "/";
		this.beforeHook = settings.hooks.before;
		this.afterHook = settings.hooks.after;
		this.securityHook = settings.hooks.secure;
		
		this.routes = [];
		if (settings.routes && settings.routes.length > 0) {
			settings.routes.forEach(route => {
				this.add(route.rule, route.handler, route.options);
			});
		}
		
		this._pageState = null;
		this._currentPage = null;
		this._skipCheck = false;
		this._action = null;
		
		if (this.mode === "hash") {
			this._historyStack = [];
			this._historyIdx = 0;
			this._historyState = "add";
		}
	}
	
	static Page = class {
		constructor(uri, query, params, state, options) {
			this.uri = uri || "";
			this.query = query || {};
			this.params = params || [];
			this.state = state || null;
			this.options = options || {};
		}
	};
	
	_getSettings(options) {
		const settings = {};
		const defaults = {
			routes: [],
			mode: "history",
			root: "/",
			hooks: {
				before: () => {},
				after: () => {},
				secure: () => true
			},
			page404: page => {
				console.error({
					page: page,
					message: "404. Page not found"
				});
			}
		};
		
		options = options || {};
		["routes", "mode", "root", "page404"].forEach(key => {
			settings[key] = options[key] || defaults[key];
		});
		
		settings.hooks = Object.assign({}, defaults.hooks, options.hooks || {});
		
		return settings;
	}
	
	_getHistoryFragment() {
		let fragment = decodeURI(window.location.pathname);
		if (this.root !== "/") {
			fragment = fragment.replace(this.root, "");
		}
		return this._trimSlashes(fragment);
	}
	
	_getHashFragment() {
		const hash = window.location.hash.substr(1).replace(/(\?.*)$/, "");
		return this._trimSlashes(hash);
	}
	
	_getFragment() {
		return this.mode === "history" ? this._getHistoryFragment() : this._getHashFragment();
	}
	
	_trimSlashes(path) {
		if (typeof path !== "string") {
			return "";
		}
		return path.toString().replace(/\/$/, "").replace(/^\//, "");
	}
	
	_page404(path) {
		this._currentPage = new Router.Page(path);
		this.notFoundHandler(path);
	}
	
	_parseRouteRule(route) {
		if (typeof route !== "string") {
			return route;
		}
		const uri = this._trimSlashes(route);
		const rule = uri
		.replace(/([\\\/\-\_\.])/g, "\\$1")
		.replace(/\{[a-zA-Z]+\}/g, "(:any)")
		.replace(/\:any/g, "[\\w\\-\\_\\.]+")
		.replace(/\:word/g, "[a-zA-Z]+")
		.replace(/\:num/g, "\\d+");
		
		return new RegExp("^" + rule + "$", "i");
	}
	
	_parseQuery(query) {
		const _query = {};
		if (typeof query !== "string") {
			return _query;
		}
		
		if (query[0] === "?") {
			query = query.substr(1);
		}
		
		this._queryString = query;
		query.split("&").forEach(row => {
			const parts = row.split("=");
			if (parts[0] !== "") {
				if (parts[1] === undefined) {
					parts[1] = true;
				}
				_query[decodeURIComponent(parts[0])] = parts[1];
			}
		});
		return _query;
	}
	
	_getHistoryQuery() {
		return this._parseQuery(window.location.search);
	}
	
	_getHashQuery() {
		const index = window.location.hash.indexOf("?");
		const query = (index !== -1) ? window.location.hash.substr(index) : "";
		return this._parseQuery(query);
	}
	
	_getQuery() {
		return this.mode === "history" ? this._getHistoryQuery() : this._getHashQuery();
	}
	
	add(rule, handler, options) {
		this.routes.push({
			rule: this._parseRouteRule(rule),
			handler: handler,
			options: options
		});
		return this;
	}
	
	remove(param) {
		if (typeof param === "string") {
			param = this._parseRouteRule(param).toString();
		}
		const _this = this;
		this.routes.some((route, i) => {
			if (route.handler === param || route.rule.toString() === param) {
				_this.routes.splice(i, 1);
				return true;
			}
			return false;
		});
		
		return this;
	}
	
	reset() {
		this.routes = [];
		this.mode = null;
		this.root = "/";
		this._pageState = {};
		this.removeUriListener();
		
		return this;
	}
	
	_pushHistory() {
		const fragment = this._getFragment();
		const _this = this;
		
		if (this.mode === "hash") {
			if (this._historyState === "add") {
				if (this._historyIdx !== this._historyStack.length - 1) {
					this._historyStack.splice(this._historyIdx + 1);
				}
				
				this._historyStack.push({
					path: fragment,
					state: _this._pageState
				});
				
				this._historyIdx = this._historyStack.length - 1;
			}
			this._historyState = "add";
		}
	}
	
	_unloadCallback(asyncRequest) {
		let result;
		
		if (this._skipCheck) {
			return asyncRequest ? Promise.resolve(true) : true;
		}
		
		if (this._currentPage && this._currentPage.options && this._currentPage.options.unloadCb) {
			result = this._currentPage.options.unloadCb(this._currentPage, asyncRequest);
			if (!asyncRequest || result instanceof Promise) {
				return result;
			}
			return result ? Promise.resolve(result) : Promise.reject(result);
			} else {
			return asyncRequest ? Promise.resolve(true) : true;
		}
	}
	
	_findRoute() {
		const fragment = this._getFragment();
		const _this = this;
		
		return this.routes.some(route => {
			const match = fragment.match(route.rule);
			if (match) {
				match.shift();
				const query = _this._getQuery();
				const page = new Router.Page(fragment, query, match, _this._pageState, route.options);
				
				if (!_this.securityHook(page)) {
					return false;
				}
				
				_this._currentPage = page;
				if (_this._skipCheck) {
					_this._skipCheck = false;
					return true;
				}
				_this.beforeHook(page);
				route.handler.apply(page, match);
				_this.afterHook(page);
				_this._pageState = null;
				
				window.onbeforeunload = ev => {
					if (_this._unloadCallback(false)) {
						return;
					}
					ev.returnValue = true;
					return true;
				};
				
				return true;
			}
			return false;
		});
	}
	
	_treatAsync() {
		let result;
		
		result = this._currentPage.options.unloadCb(this._currentPage, true);
		if (!(result instanceof Promise)) {
			result = result ? Promise.resolve(result) : Promise.reject(result);
		}
		
		result
		.then(this._processUri.bind(this))
		.catch(this._resetState.bind(this));
	}
	
	_resetState() {
		this._skipCheck = true;
		this.navigateTo(this._current, this._currentPage.state, true);
	}
	
	_processUri() {
		const fragment = this._getFragment();
		let found;
		
		this._current = fragment;
		this._pushHistory();
		
		found = this._findRoute.call(this);
		if (!found) {
			this._page404(fragment);
		}
	}
	
	check() {
		if (this._skipCheck) return this;
		
		if (this._currentPage && this._currentPage.options && this._currentPage.options.unloadCb) {
			this._treatAsync();
			} else {
			this._processUri();
		}
		return this;
	}
	
	addUriListener() {
		if (this.mode === "history") {
			window.onpopstate = this.check.bind(this);
			} else {
			window.onhashchange = this.check.bind(this);
		}
		
		return this;
	}
	
	removeUriListener() {
		window.onpopstate = null;
		window.onhashchange = null;
		return this;
	}
	
	redirectTo(path, state, silent) {
		path = this._trimSlashes(path) || "";
		this._pageState = state || null;
		this._skipCheck = !!silent;
		
		if (this.mode === "history") {
			history.replaceState(state, null, this.root + this._trimSlashes(path));
			return this.check();
			} else {
			this._historyIdx--;
			window.location.hash = path;
		}
		return this;
	}
	
	navigateTo(path, state, silent) {
		path = this._trimSlashes(path) || "";
		this._pageState = state || null;
		this._skipCheck = !!silent;
		
		if (this.mode === "history") {
			history.pushState(state, null, this.root + this._trimSlashes(path));
			return this.check();
			} else {
			window.location.hash = path;
		}
		return this;
	}
	
	refresh() {
		if (!this._currentPage) {
			return this;
		}
		const path = this._currentPage.uri + "?" + this._queryString;
		return this.navigateTo(path, this._currentPage.state);
	}
	
	back() {
		if (this.mode === "history") {
			window.history.back();
			return this;
		}
		
		return this.go(this._historyIdx - 1);
	}
	
	forward() {
		if (this.mode === "history") {
			window.history.forward();
			return this;
		}
		
		return this.go(this._historyIdx + 1);
	}
	
	go(count) {
		if (this.mode === "history") {
			window.history.go(count);
			return this;
		}
		
		const page = this._historyStack[count];
		if (!page) {
			return this;
		}
		
		this._historyIdx = count;
		this._historyState = "hold";
		return this.navigateTo(page.path, page.state);
	}
}
