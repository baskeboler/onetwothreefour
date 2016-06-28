var express = require('express');
var router = express.Router();
var bandController = require('../controllers/band');
var debug = require('debug')('onetwothreefour:band-router');

router.param('bandId', function(req, res, next, bandId) {
    debug(`captured bandId=${bandId}`);
    req.bandId = bandId;
    next();
});

router.route('/')
  .get(bandController.all)
  .post(bandController.create)
  .put(bandController.update);

router.route('/:bandId')
  .get(bandController.get)
  .delete(bandController.remove);

module.exports = router;
