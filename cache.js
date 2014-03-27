function SmartCache() {
	this._intervals = [];
}
SmartCache.prototype.add = function(name, interval, fn) {
	this.fns[name] = fn;
	var handler = this._intervalHandler.bind(this, name, fn);
	var n = setInterval(handler, interval);
	this._intervals.push(n);
	handler();
}
SmartCache.prototype._intervalHandler = function(name, fn) {
	var self = this;
	fn(function(value) {
		self[name] = value;
	});
}
SmartCache.prototype.destroy = function() {
	this._intervals.forEach(clearInterval);
}

module.exports = function() {
	return new SmartCache();
}
