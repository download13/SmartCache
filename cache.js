var DEFAULT_WAIT = 40;
var slice = Array.prototype.slice;

function SmartCache() {
	this.data = {};
	this._timeouts = {};

	this._sources = {};
	this._pending = {};
}
SmartCache.prototype.add = function(name, fn, expire) {
	fn._expire = expire;
	this._sources[name] = fn;
}
SmartCache.prototype.get = function(name, arg, cb) {
	var key = name;
	if(cb == null) {
		cb = arg;
		arg = null;
	}
	if(arg != null) {
		key += ':' + arg;
	}

	if(key in this.data) { // Try to get the value from stored data
		cb(this.data[key]);
		return;
	}
	var p = this._pending;
	if(p[key]) { // Someone is already getting it, just wait
		setTimeout(this.get.bind(this, name, arg, cb), DEFAULT_WAIT);
		return;
	}
	var fn = this._sources[name];
	if(!fn) { // No data source for this name
		cb();
		return;
	}
	p[key] = true;
	fn(arg, function(v) {
		p[key] = false;
		this.set(key, v, fn._expire);
		cb(v);
	}.bind(this));
}
SmartCache.prototype.set = function(name, value, expire) {
	this.data[name] = value;
	if(expire) {
		var t = this._timeouts;
		if(t[name] != null) {
			clearTimeout(t[name]);
		}
		t[name] = setTimeout(function() {
			delete this._timeouts[name];
			delete this.data[name];
		}.bind(this), expire);
	}
}
SmartCache.prototype.destroy = function() {
	var t = this._timeouts;
	Object.keys(t).forEach(function(name) {
		clearTimeout(t[name]);
	});
}

module.exports = function() {
	return new SmartCache();
}
