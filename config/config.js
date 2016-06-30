var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('onetwothreefour:config');

var dbuser = process.env.DB_USER || '',
    dbpassword = process.env.DB_PASSWORD || '',
    isLocal = process.env.LOCAL != undefined;
var mongoUri = (isLocal) ?
    'mongodb://127.0.0.1/onetwothreefour-express'
    : `mongodb://${dbuser}:${dbpassword}@ds023694.mlab.com:23694/onetwothreefour`;
var uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
var tmpDir = process.env.TEMP_DIR || path.join(process.cwd(), 'temp');

var config = {
    mongoUri: mongoUri,
    defaults: {
        pageSize: 10
    },
    uploadsDir: uploadsDir,
    tmpDir: fs.mkdtempSync(tmpDir + path.sep)
};


process.on('exit', (code) => {
    console.log(`process exiting with code ${code}`);
    debug('process exiting, removing temp dir');
    var files = fs.readdirSync(config.tmpDir);
    for (var i=0; i < files.length; i++) {
        debug(`removing file ${files[i]}`);
        fs.unlinkSync(path.join(config.tmpDir, files[i]));
    }
    fs.rmdirSync(config.tmpDir);
    debug(`successfully deleted tmp dir ${config.tmpDir}`);
});

process.on('SIGINT', () => {
    debug('SIGINT received');
    process.exit(0);
});
module.exports = config;