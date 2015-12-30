describe('angular-async-form', function() {
  var $compile;
  var expect = chai.expect;
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
        '    <af-control-message>{{ error }}</af-control-message>',
        '    <input name="firstName" ng-model="user.firstName" af-control />',
        '</form>'
    ].join('\n'));
  });

  describe('when name is not present on af-control', function() {
    it('should throw an error', function() {
      expect(function() {
        build([
            '<form af-submit="doSomething($event, cb)">',
            '  <af-message>{{ message }}</af-message>',
            '  <div class="control-group" af-control-group>',
            '    <af-control-message>{{ error }}</af-control-message>',
            '    <input ng-model="user.firstName" af-control />',
            '</form>'
        ].join('\n'));
      }).to.throw(/afControl requires a name attribute/);
    });
  });

  describe('when multiple af-controls are present with the same name', function() {
    it('should not throw an error', function() {
      build([
          '<form af-submit="doSomething($event, cb)">',
          '  <af-message>{{ message }}</af-message>',
          '  <div class="control-group" af-control-group>',
          '    <af-control-message>{{ error }}</af-control-message>',
          '    <input name="firstName" ng-model="user.firstName" af-control />',
          '    <input name="firstName" ng-model="user.firstName" af-control />',
          '</form>'
      ].join('\n'));
    });
  });

  function build(markup) {
    $root = $compile(markup)($scope);
    $scope.$apply();
  }
});
