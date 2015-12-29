var myApp = angular.module('myApp', ['angular-async-form']);

myApp.controller('AppCtrl', function($scope, $http, $q) {
  $scope.user = {};
  $scope.doSomething = function($event, firstName, cb) {
    return $http.get('/firstNames/' + firstName).then(function(response) {
      response.data;// do something cool with it
    })
    .catch(function(response) {
      cb('Something bad happened at ' + Date.now(), response.data);
    });
  };
});


