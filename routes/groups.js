'use strict';

var util = require('util');
var express = require('express');
var router = express.Router();

const groupsModel = require('../models/groups-mysql');
const log = require('debug')('chat:router-groups');
const error = require('debug')('chat:error');


