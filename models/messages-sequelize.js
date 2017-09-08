'use strict'

const Sequelize = require('sequelize');
const fs = require('fs');
const jsyaml = require('js-yaml');
const util = require('util');

const log = require('debug')('messages:messages-model');
const error = require('debug')('messages:error');

var SQMessage;
var sequlz;

exports.connectDB = function(db_name) {
  if(SQMessage) return SQMessage.sync();

  return new Promise((resolve, reject) => {
    fs.readFile(process.env.SEQUELIZE_CONNECT, 'utf8', (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  })
  .then(yamltext => jsyaml.safeLoad(yamltext, 'utf8'))
  .then(params => {
    if(!sequlz) sequlz = new Sequelize(params.dbname, params.username, params.password, params.params);

    if(!SQMessage) SQMessage = sequlz.define('Message', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      from: Sequelize.STRING, // user that sent the message
      group_id: Sequelize.INTEGER, // unique id of the chat group
      message: Sequelize.STRING,
      timestamp: Sequelize.DATE
    });
    return SQMessage.sync();
  });
};

exports.sendMessage = function(from, group_id, message) {
  exports.connectDB('Message')
  .then(SQMessage => SQMessage.create({
    from, group_id, message, timestamp: new Date()
  }))
  .then(newmsg => {
    var toEmit = {
      id: newmsg.id,
      from: newmsg.from,
      group_id: newmsg.group_id,
      message: newmsg.message,
      timestamp: newmsg.timestamp
    };
  });
};

exports.deleteMessage = function(id) {
  exports.connectDB('Message')
  .then(SQMessage => SQMessage.find({ where: { id } }))
  .then(msg => msg.destroy());
};

