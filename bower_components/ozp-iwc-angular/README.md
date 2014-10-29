ozp-iwc-angular
===============

Angular wrappers around the [OZP-IWC](https://github.com/ozone-development/ozp-iwc). 
See the IWC [wiki](https://github.com/ozone-development/ozp-iwc/wiki) for the 
full documentation of the IWC's API. 

## Usage
Include [Angular.js](https://angularjs.org/) in your index, then include the 
appropriate file from this repo. Typically you will use the Client file.

In development, you should use non minified files like `ozpIwc-client-angular.js`. 
In production, use the minified version, `ozpIwc-client-angular.min.js`.

Then in your app module, declare the `ozpIwcClient` as one of your dependencies (
you may also depend on `ozpIwcBus` and/or `ozpIwcMetrics`)

```javascript
var myApp = angular.module('myApp', [ 'ozpIwcClient' ]);
```

You are then able to use Angular's [Dependency Injection](https://docs.angularjs.org/guide/di) 
to access the IWC object. Such as:

```javascript
myApp.service('fooService', [ 'iwcClient', function(iwcClient) {
  // Do IWC stuff here
}]);
```

## Testing
First, launch the 'ozone bus': ```grunt connect:ozonebus```

Then, in two other terminals, run ```grunt connect:sender``` 
and ```grunt connect:receiver```

Send text via the sender and see that it shows up in the receiver

## Updating
To update using the latest version of ozp-iwc, run 
```
bower update
grunt
```