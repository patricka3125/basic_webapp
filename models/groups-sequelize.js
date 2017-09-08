'use strict'

const Sequelize = require('sequelize');
const fs = require('fs');
const jsyaml = require('js-yaml');
const util = require('util');

const log = require('debug')('groups:messages-model');
const error = require('debug')('groups:error');

var SQGroup;
var sequlz;

exports.connectDB = function() {
  if(SQGroup) return SQGroup.sync();

  return new Promise((resolve, reject) => {
    fs.readFile(process.env.SEQUELIZE_CONNECT, 'utf8', (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  })
  .then(yamltext => jsyaml.safeLoad(yamltext, 'utf8'))
  .then(params => {
    if(!sequlz) sequlz = new Sequelize(params.dbname, params.username, params.password, params.params);

    if(!SQGroup) SQGroup = sequlz.define('Group_Users', {
      uuid: { type: Sequelize.UUID, primaryKey: true },
      group_id: { type: Sequelize.INTEGER, autoIncrement: true}, // unique identifier for a group
      group_name: Sequelize.STRING, // Name of the group that will be displayed
      username: Sequelize.STRING  // User that belongs in the group
    });
    return SQGroup.sync();
  });
};

exports.createGroup = function(group_name, username) {
  return exports.connectDB()
  .then(SQGroup => {
    return SQGroup.create({ 
      group_name, username 
    });
  });
};

exports.addToGroup = function(group_id, username) {
  return exports.connectDB()
  .then(SQGroup => SQGroup.find({ where: { group_id: group_id }, rejectOnEmpty: true }))
  .then(group => SQGroup.create({ group_id, group_name: group.group_name, username }))
  .catch(err => {
    error(err.message);
    error(err.stack);
  });
};

exports.deleteFromGroup = function(group_id, username) {
  return exports.connectDB()
  .then(SQGroup => SQGroup.find({ where: { group_id: group_id, username: username } }))
  .then(user => user.destroy())
  .catch(err => {
    error(err.message);
    error(err.stack);
  });
};
