var express = require('express');
var debug = require('debug')('onetwothreefour:picture-router');
var ctrl = require('../controllers/picture');
var router = express.Router();
router.param('reference', (req, res, next, reference) => {
    debug(`captured reference=${reference}`);
    req.reference = reference;
    next();
});
router.param('pictureId', (req, res, next, pictureId) => {
    debug(`captured pictureId=${pictureId}`);
    req.pictureId = pictureId;
    next();
});
router.post('/:reference', ctrl.upload);
router.get('/:pictureId', ctrl.get);
module.exports = router;