# angular-async-form [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Async form handling the angular way.

If you've been developing angular apps you know how difficult it is to handle
errors from a backend after submitting a form.  Common scenarios include:

* 500 errors with messages like `Sorry, an unkown error occured.  Please try again.`
* 400 errors from input validation that were not caught in the UI.

Angular provides a great set of directives _if_ your only concern is immediate client
side validation; however, they fall short for anything else.

`angular-async-form` (namespaced `af`) fills this gap with the following
directives:

* [afSubmit](#afsubmit)  This is a direct replacement for `ngSubmit`.
* [afMessage](#afmessage)  Displays a form wide message from the backend.
* [afControlGroup](#afcontrolgroup)  Groups a form control with a corresponding
message from the backend.
* [afControl](#afcontrol)  Adds a form control to a form control group.
* [afControlMessage](#afcontrolmessage)  Adds a message to a form control group.

## Highlights

* Unobtrusive.  Use `afControlMessage` in concert with `ngMessages` to display known
validation errors in the UI before submitting the form, and unkown errors from async
operations after the form is submitted.
* Prevents the form from being submitted if an error was returned for a control.  The
control _must_ receive a `blur` event before setting it's validity again to `true`.
* Display form wide error messages.
* 100% asynchronous.  May be used with or without HTTP calls.
* Versatile Directive API.
* Handles all input types I.E. `input[type=radio]`, `input[type=checkbox]`, `textara`
etc.

## Full Example
The directives are used in concert as follows:

```html
<!DOCTYPE html>
<html ng-app="myApp">
  <head>
    <style>
    .error {color: red;}
    </style>
  </head>
  <body ng-controller="AppCtrl">
    <h1>Hello {{ user.firstName }}!</h1>

    <form af-submit="doSomething($event, user.firstName, cb)" novalidate>
      <div class="error" af-message>{{ message }}</div>
      <div class="control-group" af-control-group>
        <div class="error" af-control-message>{{ error }}</div>

        <input
          name="firstName"
          ng-model="user.firstName"
          af-control
          required>
        <button type="submit">Submit</button>
      </div>
    </form>

    <script src="https://code.angularjs.org/1.4.8/angular.js"></script>
    <script src="angular-async-form.js"></script>
    <script src="app.js"></script>
  </body>
</html>
```

## Directive API

### afSubmit

|Restriction|Requires|Scope|
|----|----|----|
|`A`|`form`|Parent Scope (afSubmit must equal an angular expression)|

Use `afSubmit` as a direct replacement for `ngSubmit`.  In addition to the `$event`
object, a callback is exposed as `cb`.  `cb` has the following signature:

```
function (message, errors)
```

* `message` - A string representing a general error message to display in the form
E.G. `Sorry, an unknown error occurred.  Please try again.`.  See [afMessage](#afmessage)
for more details on displaying this value to a user.
* `errors` - An enum of strings corresponding to control messages E.G.
  ```javascript
  {
    firstName: 'First names must start with the letter J at 4\'oclock in the afternoon.',
    lastName: 'We could not accept this value at this time.'
  }
  ```
  See [afControlMessage](#afcontrolmessage) for more details.

### afMessage

|Restriction|Requires|Scope|
|----|----|----|
|`AE`|`^^afSubmit`|Child Scope provides `message`|

Displays a general message from the backend.  The message is provided by passing a
string as the `message` parameter in the `afSubmit` callback function.

### afControlGroup

|Restriction|Requires|Scope|
|----|----|----|
|`AE`|`^^afSubmit`|Parent Scope|

Groups a form control with a corresponding message from the backend.  This allows
control messages to apply for a group of radio buttons or checkboxes.

### afControlMessage

|Restriction|Requires|Scope|
|----|----|----|
|`AE`|`^^afControlGroup`|Child Scope provides `message`|

Adds a message to a form control group.  If the control received an error via the
`errors` parameter to the callback in `afSubmit` then it will be provided in this
directive's scope.

### afControl

|Restriction|Requires|Scope|
|----|----|----|
|`A`|`^^afControlGroup, ngModel`|Parent Scope (name is a required attribute)|

Adds a form control to `afControlGroup`.  The `name` attribute is used as the
key when supplying `errors` to the callback function in `afSubmit`.  This directive
may be used any number of times within `afControlGroup` (I.E. with radio inputs).
If this directive does not exist within `afControlGroup`, then no error will display
in `afControlMessage`.

Errors from the backend must be resolved by triggering a blur event on the control;
otherwise, successive form submissions will be blocked.

## License

``````
The MIT License (MIT)

Copyright (c) 2015 Kogo Software LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
``````

[downloads-image]: http://img.shields.io/npm/dm/angular-async-form.svg
[npm-url]: https://npmjs.org/package/angular-async-form
[npm-image]: http://img.shields.io/npm/v/angular-async-form.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/angular-async-form
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/angular-async-form.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/angular-async-form
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/angular-async-form/master.svg
