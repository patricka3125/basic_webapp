var express = require('express');
var router = express.Router();
var path = require('path');
//var messages = require(process.env.CHAT_MODEL ? path.join('..', process.env.CHAT_MODEL) : '../models/messages-sequelize');

const log = require('debug')('chat:router-home');
const error = require('debug')('chat:error');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Chat App',
    //messagelist: messagelist
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {});
});

module.exports = router;
