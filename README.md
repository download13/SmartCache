SmartCache
======

`npm install smartcache`

Not every request you serve needs to be making a database call. For lots of public data, updating once every second is good enough. SmartCache is a little utility that lets you add data sources and decide how often they refresh. Then just read the data from the cache whenever you need to display it.

API
=======

.add(name, interval, fn)
------------------

Add a new data source to the cache under `name`. It will refresh every `interval` milliseconds. `fn` will be called with one argument (a callback function) on every refresh.

.destroy()
----------------

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
    res.send(cache.news);
}
```
