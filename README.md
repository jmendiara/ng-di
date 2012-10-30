# ng-di

Spectacular Angular Dependency Injection isolated as a library

**CURRENTLY IN DEVELOPMENT**

## Getting Started
### On the server
Install the module with: `npm install ng-di`

```javascript
var di = require('ng-di');
di.module(...);
```

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/jmendiara/ng-di/master/dist/ng-di.min.js
[max]: https://raw.github.com/jmendiara/ng-di/master/dist/ng-di.js

In your web page:

```html
<script src="dist/ng-di.min.js"></script>
<script>
di.module(...)
</script>
```

In your code, you can attach ng-di's methods to any object.

```html
<script>
this.exports = Bocoup.utils;
</script>
<script src="dist/ng-di.min.js"></script>
<script>
Bocoup.utils.di.module(...);
</script>
```

## Documentation
This library simply isolates [AngularJS](http://www.angularjs.org)
[dependency injection](http://docs.angularjs.org/guide/di), exposing its
[module API](http://docs.angularjs.org/guide/module) as part of it.

All the DOM management has been removed, and makes this library the ideal artifact for using
 Javascript Dependency Injection in javascript only apps, libraries...

It's available as `di` instead of `angular`


## Examples

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Javier Mendiara  
Licensed under the MIT license.
