'use strict'

const util = require('util');
const path = require('path');
const express = require('express');
const router = express.Router();
exports.router = router;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const usersModel = require(process.env.USERS_MODEL
	? path.join('..', process.env.USERS_MODEL)
	: '../models/users-rest');

const log = require('debug')('chat:router-users');
const error = require('debug')('chat:error');

exports.initPassport = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());
};

// What passport uses to authenticate
passport.use(new LocalStrategy(
  function(username, password, done) {
    usersModel.userPasswordCheck(username, password)
    .then(check => {
      if(check.check) { // userPasswordcheck returns true

        done(null, {
          id: check.user_id, 
          username: check.username 
        }, 
        {
          message: check.message
        });

      } else { // userPasswordCheck returns false
        done(null, false, { message: check.message });
      }
      return check;
    })
    .catch(err => done(err));
  })
);

// Ensures that user session is still logged in
exports.ensureAuthenticated = function(req, res, next) {
  // req.user is set by Passport in the deserialize function 
  if(req.user) next();
  else res.redirect('/users/login');
};

// Sign up Page
router.get('/signup', function(req, res, next) {
  res.render('signup', {
    title: "Create an Account",
  });
});

// Create Account
/*router.post('/signup', function(req, res, next) {
  
});*/

// Login Page
router.get('/login', function(req, res, next) {
  //log(util.inspect(req));
  res.render('login', {
    title: "Login",
    user: req.user ? req.user : undefined,
    errorMsg: req.flash('error')
  });
});

// Login
router.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/',	// SUCCESS: Go to home page
    failureRedirect: 'login',	// FAIL: Go to /user/login
    failureFlash: true,
    successFlash: true
  })
);

// Logout, redirects to home page
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  usersModel.find(username)
  .then(user => done(null, user))
  .catch(err => done(err));
});
