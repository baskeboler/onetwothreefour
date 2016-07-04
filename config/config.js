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
var cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'onetwothreefour',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    url: process.env.CLOUDINARY_URL
};

var config = {
    mongoUri: mongoUri,
    defaults: {
        pageSize: 10
    },
    uploadsDir: uploadsDir,
    tmpDir: fs.mkdtempSync(tmpDir + path.sep),
    cloudinary: cloudinaryConfig
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