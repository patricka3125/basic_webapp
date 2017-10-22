'use strict'

const mysql = require('mysql');

const log = require('debug')('chat:group_user-mysql');
const error = require('debug')('chat:error');

var groupUser_connect;

exports.connectDB = function() {
  return new Promise((resolve, reject) => {
    groupUser_connect = mysql.createConnection({
      host	: 'localhost',
      port	: '3306',
      user	: 'NodeClient',
      password	: 'Pr@xxis!3125',
      database	: 'Chat'
    });

    groupUser_connect.connect(err => {
      if(err) reject(err);
      else resolve(groupUser_connect);
    });
  });
};

/* Adds a user to a group. User should already be checked before if exists in
   user DB. Promise function that doesn't return anything. */ 
exports.addUser = function(group_id, user_id) {
  exports.connectDB()
  .then(connection => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO `group_users` SET `group_id` = ?,' +
			' `user_id` = ?', [group_id, user_id],
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

exports.deleteUser = function(group_id, user_id) {
  exports.connectDB()
  .then(connection => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM `group_users` WHERE `group_id` = ? ' +
			'AND `user_id` = ?', [group_id, user_id],
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

/* Returns resolved promise function that returns an array of user_id's for
   specified group_id. */
exports.listUsers = function(group_id) {
  exports.connectDB()
  .then(connection => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM `group_users` WHERE `group_id` = ?',
      group_id, function(err, results, fields) {
        if(err) reject(err);
        else resolve(results);
      });
    })
    .then(results => {
      results.map(result => {
        console.log(result.user_id);
	return result.user_id;
      });
      return results;
    }); 
  });
};
