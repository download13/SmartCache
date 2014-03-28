var assert = require('assert');
var sc = require('../cache.js');

describe('SmartCache', function() {
	var cache;
	var oldTime;
	it('should be created without errors', function() {
		cache = sc();
	});
	it('should not get a nonexistent value', function(done) {
		cache.get('test', function(v) {
			assert.equal(v, undefined);
			done();
		});
	});
	it('should set a value', function() {
		cache.set('test', 'val', 200);
	});
	it('should add a source that expires in 300ms', function() {
		cache.add('source', function(cb) {
			cb(Date.now());
		}, 300);
	});
	it('should get a set value', function(done) {
		cache.get('test', function(v) {
			assert.equal(v, 'val');
			done();
		});
	});
	it('should wait until the value expires', function(done) {
		setTimeout(function() {
			done();
		}, 250);
	});
	it('should not get an expired value', function(done) {
		cache.get('test', function(v) {
			assert.equal(v, undefined);
			done();
		});
	});
	it('should get a sourced value', function(done) {
		cache.get('source', function(v) {
			oldTime = v;
			var d = Math.abs(v - Date.now());
			if(d > 300) assert.fail(d, '< 300');
			done();
		});
	});
	it('should wait half the timeout', function(done) {
		setTimeout(function() {
			done();
		}, 150);
	});
	it('should get the same value from sourced', function(done) {
		cache.get('source', function(v) {
			var d = Math.abs(v - Date.now());
			if(d > 300) assert.fail(d, '< 300');
			if(v !== oldTime) assert.fail(v, oldTime);
			done();
		});
	});
});
