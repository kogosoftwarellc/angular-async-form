var express = require('express');
var app = express();
var path = require('path');
var result = {
  firstName: 'foo'
};
var state = 0;

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, 'lib')));

app.get('/firstName', function(req, res) {
  if (!state) {
    state++
    res.status(400).json(result);
  } else {
    state--;
    res.status(200).json({});
  }
});

app.listen(3000);
