var express = require('express');
var router = express.Router();
var usersRouter = require('./routes/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.use('/users', usersRouter);

module.exports = router;
