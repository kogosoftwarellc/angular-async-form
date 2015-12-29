describe('angular-async-form', function() {
  var $compile;
  var $root;
  var $scope;

  beforeEach(module('angular-async-form'));
  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    var $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
  }));

  it('should compile', function() {
    build([
        '<form af-submit="doSomething($event, cb)">',
        '  <af-message>{{ message }}</af-message>',
        '  <div class="control-group" af-control-group>',
        '    <af-control-error>{{ error }}</af-control-error>',
        '    <input name="firstName" ng-model="user.firstName" af-control />',
        '</form>'
    ].join('\n'));
  });

  function build(markup) {
    $root = $compile(markup)($scope);
    $scope.$apply();
  }
});
