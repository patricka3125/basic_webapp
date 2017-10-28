'use strict'

const mysql = require('mysql');

const log = require('debug')('chat:groups-mysql');
const error = require('debug')('chat:error');
const group_user = require('./group_user-mysql');

var group_connect;

// Establish connection to database.
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

/*
  Create new group with user specified group name
*/
exports.createGroup = function(group_name) {
  exports.connectDB()
  .then(connection => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO `groups` SET `group_name` = ?', group_name,
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

/*
  Delete group from database. Also deletes all entries of users in this group 
  in group_users table.
*/
exports.deleteGroup = function(group_id) {
  exports.connectDB()
  .then(connection => {
    return new Promise((resolve, reject) => {

      // Delete entries of users in group_users belonging to the group
      group_user.deleteGroup(group_id);

      connection.query('DELETE FROM `groups` WHERE `group_id` = ?', group_id,
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

/*
  Returns type RowDataPacket of a group of parameterized group_id.
*/
exports.findGroup = function(group_id) {
  exports.connectDB()
  .then(connection => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM `groups` WHERE `group_id` = ?', group_id,
        function(err, results, fields) {
          if(err) reject(err);
          else resolve(results);
        }
      );
    });
  });
};

/*
  Returns number of groups in table as a resolved promise.
*/
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
      console.log("Count: " + results[0].count);
      return results[0].count;
    });
  });
};
