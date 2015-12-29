var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, '..', 'dist')));

app.get('/firstNames/:firstName', function(req, res) {
  if (req.params.firstName !== 'John') {
    res.status(400).json({
      firstName: 'firstName must equal John'
    });
  } else {
    res.status(200).json({});
  }
});

app.listen(3000);
