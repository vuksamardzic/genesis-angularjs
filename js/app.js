/**
 * File: app.js
 * @desc Main file of angular app
 * Author: Vuk Samardzic <samardzic.vuk@gmail.com>
 */

/**
 * @name Module: app.lib
 * @desc Module with all dependencies
 * @memberOf Module: app
 */
angular.module('app.lib', ['ui.router']);

/**
 * @name Module: app
 * @desc Main application module
 */
angular.module('app', ['app.lib', 'app.core', 'app.components']);


angular
    .module('app')
    .config(config);

config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$urlMatcherFactoryProvider', '$transitionsProvider'];

function config ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $urlMatcherFactoryProvider, $transitionsProvider)
{
    $urlMatcherFactoryProvider.strictMode(false);
    // $httpProvider.defaults.withCredentials = true;

    // Rule that converts url to lower case
    $urlRouterProvider.rule(function($injector, $location)
    {
        var path = $location.path(),
            lowerCasePath = path.toLowerCase();

        if ( path !== lowerCasePath )
        {
            $location.replace().path(lowerCasePath);
        }
    });

    $urlRouterProvider.otherwise('/');
}

angular
    .module('app')
    .run(run);

run.$inject = ['$rootScope', '$http', '$transitions'];

function run ($rootScope, $http, $transitions)
{
    $transitions.onEnter({}, function(t) {});
    $transitions.onError({}, function(t) {});
    $transitions.onSuccess({}, function (t) {});
}