var express = require('express');
var router = express.Router();
var venueController = require('../controllers/venue');
var debug = require('debug')('onetwothreefour:venue-router');

router.param('venueId', function(req, res, next, venueId) {
    debug(`captured venueId=${venueId}`);
    req.venueId = venueId
    next();
});

router.route('/')
  .get(venueController.all)
  .post(venueController.create)
  .put(venueController.update);

router.route('/:venueId')
  .get(venueController.get)
  .delete(venueController.remove);

module.exports = router;
