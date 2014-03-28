SmartCache
==========

`npm install smartcache`

Not every request you serve needs to be making a database call. For lots of public data, updating once every second is good enough. SmartCache is a little utility that lets you add data sources and decide how often they refresh. Then just read the data from the cache whenever you need to display it.

API
===

.add(name, fn[, expire])
------------------------

Add a new data source called `name`. The cached value of `name` will expire every `expire` milliseconds. `fn` should be of the form `function(arg, cb)` where `cb` is the callback used to return the value, and `arg` is a (possibly null) argument passed from a `get` call. Each value from this source with a different `arg` will be cached seperately.

.get(name[, argument], cb)
--------------

Get a value by name. `cb` is called with one argument (the value). `argument` is an optional parameter that will be passed to the data source if available for this request.

.set(name, value[, expire])
---------------------------

Set a value that expires after `expire` milliseconds.

.destroy()
----------

Stops all the refresh events from firing.

examples
========

```javascript
var cache = require('smartcache')(); // Get new cache

cache.add('news', function(arg, cb) {
	db.getNewsItems(function(items) {
		cb(newsTemplate.render(items));
	});
}, 5000); // Every 5 seconds is good enough

function serveNews(req, res) {
	cache.get('news', function(news) {
		res.send(news);
	});
}
```

An example passing arguments to the data source

```javascript
cache.add('hi', function(arg, cb) {
	cb('Hello ' + arg + '!');
}); // No expire argument; cached values never expire

function serveHello(req, res) {
	cache.get('hi', 'Larry', function(m) {
		res.send(m);
	});
}
```
