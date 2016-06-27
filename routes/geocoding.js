var express = require('express'),
    debug = require('debug')('onetwothreefour:geocoding-router'),
    router = express.Router(),
    controller = require('../controllers/geocoding');

router.param('city', (req, res, next, city) => {
    debug(`captured city: ${city}`);
    req.city = city;
    next();
});

router.param('country', (req, res, next, country) => {
    debug(`captured country: ${country}`);
    req.country = country;
    next();
});

router.get('/search/country/:country', controller.country);
router.get('/search/city/:city', controller.city);

module.exports = router;
