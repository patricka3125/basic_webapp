'use strict'

const mysql = require('mysql');

const log = require('debug')('chat:groups-mysql');
const error = require('debug')('chat:error');

var group_connect;

exports.connectDB = function() {
  return new Promise((resolve, reject) => {
    group_connect = mysql.createConnection({
      host	: 'localhost',
      port	: '3306',
      user	: 'NodeClient',
      password	: 'Pr@xxis!3125',
      database	: 'Chat'
    });

    group_connect.connect(err => {
      if(err) reject(err);
      else resolve(group_connect);
    });
  });
};

exports.createGroup = function(groupname) {
  exports.connectDB()
  .then(connection => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO `groups` SET `group_name` = ?', groupname,
	function(err, results, fields) {
	  if(err) reject(err);
	  else resolve(results);
        }
      );
    })
    .then(results => {
      console.log(results);
    });
  });
};

exports.deleteGroup = function(groupid) {
  exports.connectDB()
  .then(connection => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM `groups` WHERE `group_id` = ?', groupid,
        function(err, results, fields) {
          if(err) reject(err);
          else resolve(results);
	}
      );
    })
    .then(results => {
      console.log(results);
    });
  });
};

exports.findGroup = function(groupid) {
  exports.connectDB()
  .then(connection => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM `groups` WHERE `group_id` = ?', groupid,
        function(err, results, fields) {
          if(err) reject(err);
          else resolve(results);
        }
      );
    });
  });
};

exports.count = function() {
  return exports.connectDB().then(connection => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT COUNT(`group_id`) AS count FROM `groups`',
	function(err, results, fields) {
          if(err) reject(err);
	  else resolve(results);
	}
      );
    })
    .then(results => {
      console.log(results[0].count);
    });
  });
};
