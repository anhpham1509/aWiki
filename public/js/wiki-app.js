//"use strict";

var app = angular.module('wiki', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('client', {
            templateUrl: 'templates/layout.html',
            controller: 'clientController'
        })
        .state('client.home', {
            url:'/',
            data: {
                title: 'aWiki - Homepage'
            },
            templateUrl: 'templates/home.html',
            controller: 'homeController'
        })

        .state('client.category', {
            url: '/categories/:catSlug',
            data: {
                title: 'aWiki - Categories'
            },
            templateUrl: 'templates/products.html',
            controller: 'categoryController'
        })

        .state('client.post', {
            url: '/categories/:catSlug/posts/:prodSlug',
            data: {
                title: 'aWiki - Posts'
            },
            templateUrl: 'templates/product-detail.html',
            controller: 'productController'
        })

        .state('client.takeCare', {
            url: '/cham-soc',
            data: {
                title: 'Liti - Cách chăm sóc'
            },
            templateUrl: 'templates/take-care.html',
            controller: 'careController'
        })

        .state('client.coOp', {
            url: '/hop-tac',
            data: {
                title: 'Liti - Hợp tác'
            },
            templateUrl: 'templates/co-op.html'
        })

        .state('client.login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginController'
        })

        .state('admin', {
            url: '/admin',
            templateUrl: 'templates/admin.html',
            controller: 'adminController'
        })
    ;
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(true);
});

app.controller('clientController', function($scope, $http){
    $http({method: 'GET', url: '/api/categories/'}).then(function (response) {
        $scope.categories = response.data;
    }, function () {
    });
});

app.controller('adminController', function($scope){
});

app.controller('homeController', function ($scope, $http) {
    $scope.css = 'style';
});

app.controller('careController', function ($scope, $http) {
    $http({method: 'GET', url: '/api/posts/'}).then(function (response) {
        $scope.posts = response.data;
    }, function () {
    });
});

app.controller('allProductsController', function ($scope, $http) {
    $http({method: 'GET', url: '/api/categories/'}).then(function (response) {
        $scope.categories = response.data;
    }, function () {
    });
    $http({method: 'GET', url: '/api/products/'}).then(function (response) {
        $scope.products = response.data;
    }, function () {
    });
});

app.controller('categoryController', function ($scope, $http, $stateParams) {
    $http({method: 'GET', url: '/api/categories/'}).then(function (response) {
        $scope.categories = response.data;
    }, function () {
    });
    $http({method: 'GET', url: '/api/products/' + $stateParams.catSlug}).then(function (response) {
        $scope.products = response.data;
    }, function () {
    });
});

app.controller('productController', function ($scope, $http, $stateParams) {
    $http({method: 'GET', url: '/api/categories/'}).then(function (response) {
        $scope.categories = response.data;
    }, function () {
    });
    $http({
        method: 'GET',
        url: '/api/products/' + $stateParams.catSlug + '/' + $stateParams.prodSlug
    }).then(function (response) {
        $scope.product = response.data;
    }, function () {
    });
});

app.directive('title', ['$rootScope', '$timeout',
    function($rootScope, $timeout) {
        return {
            link: function() {

                var listener = function(event, toState) {

                    $timeout(function() {
                        $rootScope.title = (toState.data && toState.data.title)
                            ? toState.data.title
                            : 'aWiki';
                    });
                };

                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }
]);