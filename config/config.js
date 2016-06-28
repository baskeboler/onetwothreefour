var dbuser = process.env.DB_USER || '',
    dbpassword = process.env.DB_PASSWORD || '',
    isLocal = process.env.LOCAL != undefined;
var path = require('path');
var mongoUri = (isLocal) ?
    'mongodb://127.0.0.1/onetwothreefour-express'
    : `mongodb://${dbuser}:${dbpassword}@ds023694.mlab.com:23694/onetwothreefour`;
var uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
var config = {
    mongoUri: mongoUri,
    defaults: {
        pageSize: 10
    },
    uploadsDir: uploadsDir
};

module.exports = config;