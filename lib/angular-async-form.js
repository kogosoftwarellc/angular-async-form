/**
 * angular-async-form
 * (c) 2015 Kogo Software LLC
 * License: MIT
 * See https://github.com/kogosoftwarellc/angular-async-form for source code.
 */
angular.module('angular-async-form', [])

.directive('afSubmit', function() {
  return {
    controller: function($parse, $scope) {
      var afSubmit = this;
      var controls = {};
      var afMessages = [];
      var submitHandler = null;

      afSubmit.errorName = 'asyncFormError';
      afSubmit.addControl = function(control) {
        if (!control.name) {
          throw new Error('name is a required attribute with controls.');
        }

        if (!(control.name in controls)) {
          controls[control.name] = control;
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
        Object.keys(errors).forEach(function(controlName) {
          if (controlName in controls) {
            controls[controlName].setPromiseError(errors[controlName]);
          }
        });
      };

      afSubmit.init = function(submitHandlerExpression) {
        submitHandler = $parse(submitHandlerExpression);
      };

      afSubmit.submit = function(event, cb) {
        submitHandler($scope, {$event: event, cb: cb});
      };
    },

    link: function(scope, el, attrs, ctrls) {
      var afSubmit = ctrls[0];
      var form = ctrls[1];

      if (!attrs.afSubmit) {
        throw new Error('afSubmit expects an angular expression');
      }

      afSubmit.init(attrs.afSubmit);

      el.on('submit', function(event) {
        if (form.$valid) {
          afSubmit.handleMessage(null);

          afSubmit.submit(event, function(message, errors) {
            afSubmit.handleMessage(message);
            afSubmit.invalidateControls(errors);
          });
        }
      });
    },
    require: ['afSubmit', 'form'],
    restrict: 'A',
    scope: false
  };
})

.directive('afMessage', function() {
  return {
    controller: function($scope) {
      var message = this;

      message.setMessage = function(message) {
        $scope.message = message;
      };
    },
    link: function(scope, el, attrs, ctrls) {
      var afMessage = ctrls[0];
      var afSubmit = ctrls[1];
      afSubmit.addMessage(afMessage);
    },
    require: ['afMessage', '^^afSubmit'],
    restrict: 'AE',
    scope: true
  };
})

.directive('afControlGroup', function() {
  return {
    controller: function() {
      var ctrlGroup = this;

      var _control = null;
      var _errorLabel = null;
      var _afSubmit = null;

      ctrlGroup.handleError = function(error) {
        if (_control) {
          _control.$setValidity(_afSubmit.errorName, false);
        }

        if (_errorLabel) {
          _errorLabel.displayError(error);
        }
      };

      ctrlGroup.hideError = function() {
        if (_control) {
          _control.$setValidity(_afSubmit.errorName, true);
        }

        if (_errorLabel) {
          _errorLabel.hideError();
        }
      };

      ctrlGroup.init = function(afSubmit) {
        _afSubmit = afSubmit;
        afSubmit.addControl(_control);
      };

      ctrlGroup.setControl = function(control) {
        _control = control;
      };

      ctrlGroup.setErrorLabel = function(errorLabel) {
        _errorLabel = errorLabel;
      };
    },

    link: function(scope, el, attrs, ctrls) {
      var ctrlGroup = ctrls[0];
      var afSubmit = ctrls[1];

      ctrlGroup.init(afSubmit);
    },

    require: ['afControlGroup', '^^afSubmit'],
    restrict: 'AE',
    scope: false
  };
})

.directive('afControlMessage', function() {
  return {
    controller: function($scope) {
      var errorLabel = this;

      errorLabel.displayError = function(error) {
        $scope.error = error;
      };

      errorLabel.hideError = function() {
        $scope.error = null;
      };
    },
    link: function(scope, el, attrs, ctrls) {
      var errorLabel = ctrls[0];
      var controlGroup = ctrls[1];
      controlGroup.setErrorLabel(errorLabel);
    },
    require: ['afControlMessage', '^^afControlGroup'],
    restrict: 'AE',
    scope: true
  };
})

.directive('afControl', function() {
  return {
    controller: function PromiseFormControl() {
      var ctrl = this;

      var _controlGroup = null;
      var _formControl = null;

      ctrl.name = null;

      ctrl.$setValidity = function(error, bool) {
        _formControl.$setValidity(error, bool);
      };

      ctrl.setPromiseError = function(error) {
        _controlGroup.handleError(error);
      };

      ctrl.init = function(name, controlGroup, formControl) {
        ctrl.name = name;
        _controlGroup = controlGroup;
        _formControl = formControl;
      };
    },

    link: function(scope, el, attrs, ctrls) {
      var afControl = ctrls[0];
      var controlGroup = ctrls[1];
      var ngModel = ctrls[2];

      if (!attrs.name) {
        throw new Error('afControl requires a name attribute');
      }

      el.on('blur', function() {
        controlGroup.hideError();
        scope.$apply();
      });
      afControl.init(attrs.name, controlGroup, ngModel);
      controlGroup.setControl(afControl);
    },

    require: ['afControl', '^^afControlGroup', 'ngModel'],
    restrict: 'A',
    scope: false
  };
});
