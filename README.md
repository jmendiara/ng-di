# ng-di

Spectacular Angular Dependency Injection isolated as a library. Working in Browser and Node enviroments


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


## Documentation
This library simply isolates [AngularJS](http://www.angularjs.org)
[dependency injection](http://docs.angularjs.org/guide/di), exposing its
[module API](http://docs.angularjs.org/guide/module) as part of it.

All the DOM management has been removed, and makes this library the ideal artifact for using
 Javascript Dependency Injection in javascript only apps, libraries...
 
It's available as `di` instead of `angular`

The public API, considered stable, is(*):
 * [module](http://docs.angularjs.org/api/angular.Module). Exposed as `di.module`
 * [injector](http://docs.angularjs.org/api/AUTO.$injector). Exposed as `di.injector`

(*)As this library is framework agnostic, the AngularJS concepts and module API methods `module.directive` 
and `module.controller` are NOT available inside the Module API

Other non documented utility methods here are for private usage, and can be removed 

Please, refer to Angular Documentation on this topics, as ng-di exposes them as-is.

## Testing
The tests provided have been written in jasmine, and are executed in browser with Karma Runner and in Node with jasmine-node

For your convenience on writting testable code using ng-di, as well as in angular, two utility functions are exposed

*Node*
```javascript

```

*Browser*
```javascript

```


## Examples
You can go to the [examples](examples) folder to see how to use in [node](examples/node) and [browser](examples/browser) 

## Aim of this project
The goal behind this project is closing the gap between the browser and node enviroments for developing testable libraries
and applications that could be used in both enviroments.  

Just provide different implementions for those environment dependant code (Browser XMLHttpRequest vs. Node http) and reuse 
all the application code

ng-di isolates you from the dependency injection in environments, but you will have to deal with the CommonsJS/AMD/no-module 
problem by yourself. Ideas are always welcome!

## Release History

### v0.2.0 
* Completely rewrite internals using commonsJS module.
* Adding mocks for both environments

#### BREAKING CHANGES
* $utils is not exposed anymore. 
* Module 'di' is not registered by default
* Removed lots of utility functions from being accesible. See [utils](lib/utils.js) for details.
* Requiring in node does not need to recall `di`. Use: `var di = require('ng-di');`

### v0.0.4 
* Adding more utilities functions to the code
 
### v0.0.3 
* Adding more utilities functions to the code

### v0.0.2 
* new service in module `di` exposing `$utils` functions

### v0.0.1 
 * First approach


## License
This work is more-than-heavily based on AngularJS Dependency injection. All credits must go to the Angular Developers
Licensed under the MIT license.
