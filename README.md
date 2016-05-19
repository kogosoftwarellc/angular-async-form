# angular-async-form
> Async form handling the angular way.

[![Bower version][bower-image]][bower-url] [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Awesome][awesome-image]][awesome-url]

If you've developed angular apps you know how difficult it is to handle
errors _after_ submitting a form.  Common scenarios include:

* 500 errors with messages like `Sorry, an unkown error occured.  Please try again.`
* 400 errors from input validation that were not caught in the UI.

Angular provides a great set of directives _if_ your only concern is immediate
validation in the UI; however, they fall short for anything else.

`angular-async-form` (namespaced `af`) fills this gap with the following
directives:

* [afSubmit](#afsubmit)  This is a direct replacement for `ngSubmit`.  It accepts
an angular expression (similar to `ngSubmit`), and in addition to `$event` it also
exposes a callback function (exposed as `cb`).  `cb` is used to communicate with the
rest of the directives listed herein.
* [afMessage](#afmessage)  Displays a form wide message.
* [afControlGroup](#afcontrolgroup)  Groups a form control with a corresponding
error message.
* [afControl](#afcontrol)  Adds a form control to a form control group.
* [afControlMessage](#afcontrolmessage)  Adds a message to a form control group.

You can customize it's behavior with [afConfig](#afconfig).

## Highlights

* Unobtrusive.  Use `afControlMessage` in concert with `ngMessages` to display
known validation errors in the UI before submitting the form, and unkown errors
from async operations after the form is submitted.
* Allows you to handle errors _after_ a form is submitted and display them to the
user inside the form.
* If an error was returned for a control (like for input validation that wasn't
handled in the UI), the control _must_ receive a `blur` event before setting it's
validity again to `true`.
* Display form wide error messages.
* 100% asynchronous.  May be used with or without HTTP calls.
* Versatile Directive API.
* Handles all input types I.E. `input[type=radio]`, `input[type=checkbox]`,
`textara`
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

    <form af-submit="doSomething($event, cb)" novalidate>
      <div class="error" af-message>{{ message }}</div>
      <div class="control-group" af-control-group>
        <div class="error" af-control-message>{{ error }}</div>

        <input
          name="firstName"
          ng-model="user.firstName"
          af-control
          required>

        <!-- doSomething($event, cb) is called.  It's up to doSomething to warn the
        user by calling cb if errors occured in async operations.  If no errors
        occurred, then doSomething can do something else like hide the form and load
        a new view. -->
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

* `message` - A message to display in the form E.G. `Sorry, an unknown error
occurred.  Please try again.`.  This can be a string or any data type if you
wish to display multiple form wide messages.  See [afMessage](#afmessage).
* `errors` - An enum of strings corresponding to control messages E.G.

  ```javascript
  {
    firstName: 'First names must start with the letter J at 4\'oclock in the afternoon.',
    lastName: 'We could not accept this value at this time.'
  }
  ```
  See [afControlMessage](#afcontrolmessage).

### afMessage

|Restriction|Requires|Scope|
|----|----|----|
|`AE`|`^^afSubmit`|Child Scope provides `message`|

Adds a message to the child scope of the element it is used on.  The message is
provided by passing a value as the `message` parameter in the `afSubmit` callback
function.

### afControlGroup

|Restriction|Requires|Scope|
|----|----|----|
|`AE`|`?^^afSubmit`|Parent Scope|

Groups a form control with a corresponding message.  This allows error messages
passed to the `errors` parameter in `afSubmit` to apply to their intended
control, or group of controls in the case of radio buttons and checkboxes.  Multiple `afControl`s must have the same name.

### afControlMessage

|Restriction|Requires|Scope|
|----|----|----|
|`AE`|`^^afControlGroup`|Child Scope provides `error`|

Adds a message to a form control group.  If the control received an error via the
`errors` parameter to the callback in `afSubmit` then it will be provided in this
directive's scope.

### afControl

|Restriction|Requires|Scope|
|----|----|----|
|`A`|`^^afControlGroup, ngModel`|Parent Scope (name is a required attribute)|

Adds a form control to a form control group.  The `name` attribute is used as the
key when supplying `errors` to the callback function in `afSubmit`.  This directive
may be used any number of times within `afControlGroup` (I.E. with radio inputs).
If this directive does not exist within `afControlGroup`, then no error will
display in `afControlMessage`.

Errors must be resolved by triggering a blur event on the control; otherwise,
successive evaluations of `afSubmit` will be blocked.

## Configuration

You can customize `angular-async-form` by using `afConfig`.

### afConfig

A simple object with the following properties:

* `updateOn` (defaults to `blur change`) Setting this to a different DOM event changes
the event used to trigger the removal of messages displayed with `afControlMessage`.

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

[awesome-image]: https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg
[awesome-url]: https://github.com/gianarb/awesome-angularjs#data-manage

[downloads-image]: http://img.shields.io/npm/dm/angular-async-form.svg
[npm-url]: https://npmjs.org/package/angular-async-form
[npm-image]: http://img.shields.io/npm/v/angular-async-form.svg
[bower-url]: https://github.com/kogosoftwarellc/angular-async-form
[bower-image]: http://img.shields.io/bower/v/angular-async-form.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/angular-async-form
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/angular-async-form.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/angular-async-form
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/angular-async-form/master.svg
