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
    user:  req.user ? req.user : undefined,
    successLogin: req.flash('success')
  });
});

module.exports = router;
