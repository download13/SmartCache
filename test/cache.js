var assert = require('assert');
var sc = require('../cache.js');

describe('SmartCache', function() {
	var cache;
	var oldTime;
	it('should be created without errors', function() {
		cache = sc();
	});
	describe('get/set', function() {
		it('should not get a nonexistent value', function(done) {
			cache.get('test', function(v) {
				assert.equal(v, undefined);
				done();
			});
		});
		it('should set a value', function() {
			cache.set('test', 'val', 200);
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
	});
	describe('data source', function() {
		it('should add a source with no expire', function() {
			cache.add('noexp', function(arg, cb) {
				cb(4);
			});
		});
		it('should add a source that expires in 300ms', function() {
			cache.add('source', function(arg, cb) {
				cb(Date.now());
			}, 300);
		});
		it('should get the sourced value', function(done) {
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
		it('should get the non-expiring value', function(done) {
			cache.get('noexp', function(v2) {
				assert.equal(v2, 4);
				done();
			});
		});
	});
	describe('parameterized data source', function() {
		it('should create source', function() {
			cache.add('hello', function(arg, cb) {
				cb('Hello ' + arg + '!');
			}, 100);
		});
		it('should get source with no argument', function(done) {
			cache.get('hello', function(v) {
				assert.equal(v, 'Hello null!');
				done();
			});
		});
		it('should get source with a null argument', function(done) {
			cache.get('hello', null, function(v) {
				assert.equal(v, 'Hello null!');
				done();
			});
		});
		it('should get source with an argument', function(done) {
			cache.get('hello', 'Tito', function(v) {
				assert.equal(v, 'Hello Tito!');
				done();
			});
		});
	});
});
