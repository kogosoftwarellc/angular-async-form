var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, '..', 'lib')));

app.get('/firstNames/:firstName', function(req, res) {
  var errors = {};

  if (req.params.firstName !== 'John') {
    errors.firstName = 'firstName must equal John';
  }

  if (req.query.title !== 'Mr') {
    errors.title = 'title must be Mr';
  }

  if (!req.query.brownHairColor) {
    errors.hairColor = 'hair color must be Brown';
  }

  if (Object.keys(errors).length) {
    res.status(400).json(errors);
  } else {
    res.status(200).json({});
  }
});

app.listen(3000);
