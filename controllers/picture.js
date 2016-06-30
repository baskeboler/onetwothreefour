var Picture = require('../models/picture');
var debug = require('debug')('onetwothreefour:picture-controller');

function upload(req, res, next) {
    var reference = req.reference;
    var picture = new Picture({
        reference: reference
    });
    debug('upload request');
    debug(`reference=${reference}`);
    picture.attach('image', req.files.image[0], (err) => {
        if (err) {
            return next(err);
        }
        picture.save((err) => {
            if (err) return next(err);
            res.send(picture);
        });
    });
}

function get(req, res, next) {
    var pictureId = req.pictureId,
        size = req.query.size || 'original';

    Picture.findById(pictureId, (err, doc) => {
        if (err) return next(err);
        res.sendFile(doc.image[size].url);
    });
}

module.exports = { 
    upload: upload,
    get: get
};
