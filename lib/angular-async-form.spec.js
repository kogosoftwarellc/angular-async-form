describe('angular-async-form', function() {
  var $compile;
  var el;
  var expect = chai.expect;
  var $root;
  var $scope;
  var submitHandler;

  beforeEach(module('angular-async-form'));
  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    var $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    submitHandler = sinon.stub();
    $scope.doSomething = submitHandler;
  }));

  describe('with proper usage', function() {
    it('should compile', function() {
      buildProperForm();
    });
  });

  describe('submitting the form', function() {
    beforeEach(function() {
      buildProperForm();
    });

    it('should call the submit handler', function() {
      $root.triggerHandler('submit');
      expect(submitHandler).to.have.been.calledWith(
          sinon.match.object, sinon.match.func);
    });

    describe('async responses', function() {
      var cb;

      beforeEach(function() {
        $root.triggerHandler('submit');
        cb = submitHandler.args[0][1];
      });

      describe('with form wide error messages', function() {
        it('should display them', function() {
          cb('something went wrong');
          $scope.$apply();
          expect($root.find('af-message').text()).to.equal(
              'something went wrong');
        });
      });

      describe('with control error messages', function() {
        it('should display them for known controls', function() {
          var error = 'are you nuts?';
          cb(null, {firstName: error, lastName: 'asdfasd', foo: 'asdfasdf'});
          $scope.$apply();
          expect($root.find('af-control-message').text()).to.equal(
              error);
        });
      });

      describe('submitting after errors were returned', function() {
        beforeEach(function() {
          cb(null, {firstName: 'asdf', foo: 'asdfasdf'});
          $scope.$apply();
          $root.triggerHandler('submit');
        });

        it('should be prevented', function() {
          expect(submitHandler).to.have.been.calledOnce;
        });

        describe('after a blur event on the offending control', function() {
          beforeEach(function() {
            $root.find('input').triggerHandler('blur');
          });

          it('should be allowed', function() {
            $root.triggerHandler('submit');
            expect(submitHandler).to.have.been.calledTwice;
          });
        });
      });
    });
  });

  describe('afSubmit', function() {
    var afSubmit;

    beforeEach(function() {
      buildProperForm();
      afSubmit = $root.controller('afSubmit');
    });

    describe('when adding a control with no name', function() {
      it('should throw an error', function() {
        expect(function() {
          afSubmit.addControlGroup(null, {});
        }).to.throw(/name is a required attribute with controls./);
      });
    });

    describe('when adding a control with a name', function() {
      it('should handle multiple controls of the same name', function() {
        afSubmit.addControlGroup('fred', {});
        afSubmit.addControlGroup('fred', {});
      });
    });
  });

  describe('when afSubmit is not given an angular expressions', function() {
    it('should throw an error', function() {
      expect(function() {
        build([
            '<form af-submit>',
            '  <af-message>{{ message }}</af-message>',
            '  <div class="control-group" af-control-group>',
            '    <af-control-message>{{ error }}</af-control-message>',
            '    <input name="firstName" ng-model="user.firstName" af-control />',
            '</form>'
        ].join('\n'));
      }).to.throw(/afSubmit requires an angular expression/);
    });
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

  describe('when multiple afControls are present in the same afControlGroup with the same name', function() {
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

  describe('when multiple afControls are present in the same afControlGroup with differing names', function() {
    it('should throw an error', function() {
      expect(function() {
        build([
            '<form af-submit="doSomething($event, cb)">',
            '  <af-message>{{ message }}</af-message>',
            '  <div class="control-group" af-control-group>',
            '    <af-control-message>{{ error }}</af-control-message>',
            '    <input name="firstName" ng-model="user.firstName" af-control />',
            '    <input name="lastName" ng-model="user.lastName" af-control />',
            '</form>'
        ].join('\n'));
      }).to.throw(/afControl\[s\] in an afControlGroup must share the same name/);
    });
  });

  describe('using afControlGroup outisde of afControl', function() {
    it('should be allowed', function() {
      build([
          '<div>',
          '  <div class="control-group" af-control-group>',
          '    <af-control-message>{{ error }}</af-control-message>',
          '    <input name="foo" af-control ng-model="foo">',
          '</div>'
      ].join('\n'));
    });
  });


  function build(markup) {
    $root = $compile(markup)($scope);
    if (el) {
      document.body.removeChild(el);
    }
    el = $root[0];
    document.body.appendChild(el);
    $scope.$apply();
  }

  function buildProperForm() {
    build([
      '<form af-submit="doSomething($event, cb)">',
      '  <af-message>{{ message }}</af-message>',
      '  <div class="control-group" af-control-group>',
      '    <af-control-message>{{ error }}</af-control-message>',
      '    <input name="firstName" ng-model="user.firstName" af-control />',
      '  </div>',
      '  <div class="control-group" af-control-group>',
      '    <input name="lastName" ng-model="user.lastName" af-control />',
      '  </div>',
      '</form>'
    ].join('\n'));
  }
});
