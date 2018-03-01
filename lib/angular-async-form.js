!function() {
/**
 * angular-async-form
 * (c) 2015 Kogo Software LLC
 * License: MIT
 * See https://github.com/kogosoftwarellc/angular-async-form for source code.
 */
angular.module('angular-async-form', [])
.constant('afConfig', {
  updateOn: 'blur change'
})
.directive('afSubmit', function() {
  return {
    controller: ['$parse', '$scope', controller],
    link: link,
    require: ['afSubmit', 'form'],
    restrict: 'A',
    scope: false
  };

  function controller($parse, $scope) {
    var afSubmit = this;
    var controls = {};
    var afMessages = [];
    var submitHandler = null;

    afSubmit.errorName = 'asyncFormError';
    afSubmit.addControlGroup = function(controlName, control) {
      if (!controlName) {
        throw new Error('name is a required attribute with controls.');
      }

      if (!(controlName in controls)) {
        controls[controlName] = control;
      }
    };

    afSubmit.addMessage = function(afMessage) {
      afMessages.push(afMessage);
    };

    afSubmit.handleMessage = function(message) {
      afMessages.forEach(function(afMessage) {
        afMessage.setMessage(message);
      });
    };

    afSubmit.invalidateControls = function(errors) {
      if (errors) {
        Object.keys(errors).forEach(function(controlName) {
          if (controlName in controls) {
            controls[controlName].handleError(errors[controlName]);
          }
        });
      }
    };

    afSubmit.init = function(submitHandlerExpression) {
      submitHandler = $parse(submitHandlerExpression);
    };

    afSubmit.submit = function(event, cb) {
      submitHandler($scope, {$event: event, cb: cb});
    };
  }

  function link(scope, el, attrs, ctrls) {
    var afSubmit = ctrls[0];
    var form = ctrls[1];

    if (!attrs.afSubmit) {
      throw new Error('afSubmit requires an angular expression');
    }

    afSubmit.init(attrs.afSubmit);

    el.on('submit', function(event) {
      if (form.$valid) {
        afSubmit.handleMessage(null);

        afSubmit.submit(event, function(message, errors) {
          afSubmit.handleMessage(message);
          afSubmit.invalidateControls(errors);
        });

        scope.$apply();
      }
    });
  }
})

.directive('afMessage', function() {
  return {
    controller: ['$scope', controller],
    link: link,
    require: ['afMessage', '^^afSubmit'],
    restrict: 'AE',
    scope: true
  };

  function controller($scope) {
    var message = this;

    message.setMessage = function(message) {
      $scope.message = message;
    };
  }

  function link(scope, el, attrs, ctrls) {
    var afMessage = ctrls[0];
    var afSubmit = ctrls[1];
    afSubmit.addMessage(afMessage);
  }
})

.directive('afControlGroup', function() {
  return {
    controller: [controller],
    link: link,
    require: ['afControlGroup', '?^^afSubmit'],
    restrict: 'AE',
    scope: false
  };

  /////////

  function controller() {
    var ctrlGroup = this;

    var _afSubmit = null;
    var _control = null;
    var _controlName = null;
    var _controlMessage = null;
    var addedToAfSubmit;

    ctrlGroup.handleError = function(error) {
      _control.$setValidity(_afSubmit.errorName, false);

      if (_controlMessage) {
        _controlMessage.displayError(error);
      }
    };

    ctrlGroup.hideError = function() {
      _control.$setValidity(_afSubmit.errorName, true);

      if (_controlMessage) {
        _controlMessage.hideError();
      }
    };

    ctrlGroup.init = function(afSubmit) {
      _afSubmit = afSubmit;
      addToAfSubmit();
    };

    ctrlGroup.setControl = function(controlName, control) {
      if (_control && control && _controlName !== controlName) {
        throw new Error(
            'afControl[s] in an afControlGroup must share the same name');
      }
      _controlName = controlName;
      _control = control;
      addToAfSubmit();
    };

    ctrlGroup.setControlMessage = function(controlMessage) {
      _controlMessage = controlMessage;
    };

    function addToAfSubmit() {
      if (!addedToAfSubmit && _afSubmit && _controlName) {
        addedToAfSubmit = true;
        _afSubmit.addControlGroup(_controlName, ctrlGroup);
      }
    }
  }

  function link(scope, el, attrs, ctrls) {
    var ctrlGroup = ctrls[0];
    var afSubmit = ctrls[1];

    if (!afSubmit) {
      var defaults = {function: noop};
      Object.keys(ctrlGroup).forEach(function(k) {
        ctrlGroup[k] = defaults[typeof ctrlGroup[k]];
      });
    } else {
      ctrlGroup.init(afSubmit);
    }
  }
})

.directive('afControlMessage', function() {
  return {
    controller: ['$scope', controller],
    link: link,
    require: ['afControlMessage', '^^afControlGroup'],
    restrict: 'AE',
    scope: true
  };

  /* @ngInject */
  function controller($scope) {
    var controlMessage = this;

    controlMessage.displayError = function(error) {
      $scope.error = error;
    };

    controlMessage.hideError = function() {
      $scope.error = null;
    };
  }

  function link(scope, el, attrs, ctrls) {
    var controlMessage = ctrls[0];
    var controlGroup = ctrls[1];
    controlGroup.setControlMessage(controlMessage);
  }
})

.directive('afControl', ['afConfig', function(afConfig) {
  return {
    link: link,
    require: ['^^afControlGroup', 'ngModel'],
    restrict: 'A',
    scope: false
  };

  function link(scope, el, attrs, ctrls) {
    var controlGroup = ctrls[0];
    var ngModel = ctrls[1];
    var name = el.attr('name');

    if (!name) {
      throw new Error('afControl requires a name attribute');
    }

    el.on(afConfig.updateOn, function() {
      controlGroup.hideError();
      scope.$apply();
    });

    controlGroup.setControl(name, ngModel);
  }
}]);

function noop(){}
}();
