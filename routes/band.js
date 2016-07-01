var express = require('express');
var router = express.Router();
var bandController = require('../controllers/band');
var debug = require('debug')('onetwothreefour:band-router');

router.param('bandId', function (req, res, next, bandId) {
  debug(`captured bandId=${bandId}`);
  req.bandId = bandId;
  next();
});

router.param('pictureId', (req, res, next, pictureId) => {
  debug(`captured pictureId=${pictureId}`);
  req.pictureId = pictureId;
  next();
});

router.param('searchString', (req, res, next, searchString) => {
  debug(`captured search string: ${searchString}`);
  req.searchString = searchString;
  next();
});

router.route('/')
  .get(bandController.all)
  .post(bandController.create)
  .put(bandController.update);
router.route('/search/:searchString')
  .get(bandController.search);

router.route('/:bandId')
  .get(bandController.get)
  .delete(bandController.remove);
router.route('/:bandId/pictures')
  .post(bandController.uploadPicture);
router.route('/:bandId/pictures/:pictureId')
  .get(bandController.getPicture)
  .delete(bandController.removePicture);
module.exports = router;
