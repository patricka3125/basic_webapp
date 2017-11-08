'use strict'

const mysql = require('mysql');

const log = require('debug')('chat:messages-mysql');
const error = require('debug')('chat:error');
const group_user = require('./group_user-mysql');

var messages_connect;

// Establish connection to database
exports.connectDB = function() {
  return new Promise((resolve, reject) => {
    messages_connect = mysql.createConnection({
      host	: 'localhost',
      port	: '3306',
      user	: 'NodeClient',
      password  : 'Pr@xxis!3125',
      database	: 'Chat'
    });

    messages_connect.connect(err => {
      if(err) reject(err);
      else resolve(messages_connect);
    });
  });
};

/* Create message sent from user_id to group. Emit to socket so users 
   can immediately see message */
exports.createAndSendMsg = function(message, group_id, user_id) {
  return exports.connectDB()
  .then(connection => {
    // Check that user is in group with userPermission function
    return group_user.userPermission(group_id, user_id)
    .then(userInGroup => {
      return new Promise((resolve, reject) => {
        if(userInGroup) {
          connection.query('INSERT INTO `messages` SET `message` = ?, ' +
                           '`user_id` = ?, ' +
                           '`group_id` = ?' , [message, user_id, group_id],
            function(err, results, fields) {
              if(err) reject(err);
              else resolve(results);
            }
          );
        } else {
          reject(new Error("User does not belong in group."));
        }
      });
    })
    .then(results => {
      console.log(results);
      return results;
    }); 
  });
};
