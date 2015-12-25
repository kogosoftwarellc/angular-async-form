var myApp = angular.module('myApp', ['promise-form']);

myApp.controller('AppCtrl', function($scope, $http, $q) {
  $scope.user = {};
  $scope.doSomething = function($event, cb) {
    return $http.get('/firstName').then(function(response) {
      response.data;// do something cool with it
    })
    .catch(function(response) {
      cb(response.data);
    });
  };
});


