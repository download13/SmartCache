var DEFAULT_WAIT = 40;

function SmartCache() {
	this.data = {};
	this._sources = {};
	this._timeouts = {};
	this._pending = {};
}
SmartCache.prototype.add = function(name, fn, expire) {
	fn._expire = expire;
	this._sources[name] = fn;
}
SmartCache.prototype.get = function(name, cb) {
	if(name in this.data) { // Try to get the value from stored data
		cb(this.data[name]);
		return;
	}
	var p = this._pending;
	if(p[name]) { // Someone is already getting it, just wait
		setTimeout(this.get.bind(this, name, cb), DEFAULT_WAIT);
		return;
	}
	var fn = this._sources[name];
	if(!fn) { // No data source for this name
		cb();
		return;
	}
	p[name] = true;
	fn(function(v) {
		p[name] = false;
		this.set(name, v, fn._expire);
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
