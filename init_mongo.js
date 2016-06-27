var mongoose = require('mongoose');
var config = require('./config/config');

var mongoUri = config.mongoUri;//process.env.MONGO_URI || 'mongodb://127.0.0.1/onetwothreefour-express';
var debug = require('debug')('onetwothreefour:mongo-init');
// var db = mongoose.createConnection(mongoUri);
mongoose.connect(mongoUri).then(function(){
  debug('Successfully connected to MongoDB');
});
