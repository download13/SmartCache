SmartCache
==========

`npm install smartcache`

Not every request you serve needs to be making a database call. For lots of public data, updating once every second is good enough. SmartCache is a little utility that lets you add data sources and decide how often they refresh. Then just read the data from the cache whenever you need to display it.

API
===

.add(name, fn, expire)
------------------------

Add a new data source called `name`. The cached value of `name` will expire every `expire` milliseconds. `fn` will be called with one argument (a callback function) on every refresh.

.get(name, cb)
--------------

Get a value by name. `cb` is called with one argument (the value).

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

cache.add('news', 5000, function(cb) { // Every 5 seconds is good enough
	db.getNewsItems(function(items) {
		cb(newsTemplate.render(items)); // No error reporting, send as first argument
	});
});

function serveNews(req, res) {
	cache.get('news', function(news) {
		res.send(news);
	});
}
```
