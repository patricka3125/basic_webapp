'use strict';

var util = require('util');
var express = require('express');
var router = express.Router();
var path = require('path');
var groups = require(process.env.GROUPS_MODEL ? path.join('..', process.env.USERS_MODEL) : '../models/groups-mysql');
var group_user = require('../models/group_user-mysql');

const usersModel = require(process.env.USERS_MODEL
	? path.join('..', process.env.USERS_MODEL)
	: '../models/users-rest');
const usersRouter = require('./users');
const log = require('debug')('chat:router-groups');
const error = require('debug')('chat:error');

// Create Group Page -- UNTESTED FUNCTION
router.get('/create-group', (req, res, next) => {
  res.render('groupedit', {
    title: "Create a Group",
    docreate: true,
    user: req.user ? req.user : undefined
  });
});

// Add a user to group -- UNTESTED FUNCTION
router.post('add-user', usersRouter.ensureAuthenticated, (req, res, next) => {
  // First make sure user exists in database
  usersModel.find(req.params.username)
  .then(user => { // Check that user has permission to add members
    if(!group_user.userPermission) res.send(500, 
	new Error('User Not Permitted to Change Group!'));
  })
  .then(() => {
    group_user.addUser(req.params.group_id, req.params.user_id);
    log('User successfully added to group: ' + req.params.group_id + '!');
    res.redirect('/');
  })
  .catch(err => { next(err); });
});

module.exports = router;
