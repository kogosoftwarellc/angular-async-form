angular.module('promise-form', [])

.directive('promiseForm', function() {
  return {
    controller: function() {
      var promiseForm = this;
      var controls = {};

      promiseForm.errorName = 'promiseForm';
      promiseForm.addControl = function(control) {
        if (control.name in controls) {
          throw new Error(control.name + ' is already registered!');
        } else {
          controls[control.name] = control;
        }
      };

      promiseForm.invalidateControls = function(errors) {
        Object.keys(errors).forEach(function(controlName) {
          if (controlName in controls) {
            controls[controlName].setPromiseError(errors[controlName]);
          }
        });
      };
    },

    link: function(scope, el, attrs, ctrls) {
      var promiseForm = ctrls[0];
      var form = ctrls[1];

      el.on('submit', function(event) {
        if (form.$valid) {
          scope.promiseForm({$event: event, cb: function(errors) {
            promiseForm.invalidateControls(errors);
          }});
        }
      });
    },
    require: ['promiseForm', 'form'],
    restrict: 'A',
    scope: {
      promiseForm: '&'
    }
  };
})

.directive('promiseFormControlGroup', function() {
  return {
    controller: function() {
      var ctrlGroup = this;

      var _control = null;
      var _errorLabel = null;
      var _promiseForm = null;

      ctrlGroup.handleError = function(error) {
        if (_control) {
          _control.$setValidity(_promiseForm.errorName, false);
        }

        if (_errorLabel) {
          _errorLabel.displayError(error);
        }
      };

      ctrlGroup.hideError = function() {
        if (_control) {
          _control.$setValidity(_promiseForm.errorName, true);
        }

        if (_errorLabel) {
          _errorLabel.hideError();
        }
      };

      ctrlGroup.init = function(promiseForm) {
        _promiseForm = promiseForm;
        promiseForm.addControl(_control);
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
      var promiseForm = ctrls[1];

      ctrlGroup.init(promiseForm);
    },

    require: ['promiseFormControlGroup', '^^promiseForm'],
    restrict: 'A',
    scope: {}
  };
})

.directive('promiseFormErrorLabel', function() {
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
    require: ['promiseFormErrorLabel', '^^promiseFormControlGroup'],
    restrict: 'A',
    scope: true
  };
})

.directive('promiseFormControl', function() {
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
      var promiseFormControl = ctrls[0];
      var controlGroup = ctrls[1];
      var ngModel = ctrls[2];

      el.on('blur', function() {
        controlGroup.hideError();
        scope.$apply();
      });
      promiseFormControl.init(scope.name, controlGroup, ngModel);
      controlGroup.setControl(promiseFormControl);
    },

    require: ['promiseFormControl', '^^promiseFormControlGroup', 'ngModel'],
    restrict: 'A',
    scope: {
      name: '@'
    }
  };
});
