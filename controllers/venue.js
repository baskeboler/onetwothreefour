var Venue = require('../models/venue');
var debug = require('debug')('onetwothreefour:venue-controller');
var _ = require('lodash');
var Q = require('q');
var search = require('./search');

function all(req, res) {
  var page = req.query.page || 1,
    pageSize = req.query.pageSize || 10,
    sort = req.query.sort || 'name',
    deferred = Q.defer();
  page--;
  debug(`page=${page}, pageSize=${pageSize}, sort=${sort}`);
  Venue.count({}, function (err, total) {
    if (err) {
      deferred.resolve(0);
    } else {
      deferred.resolve(total);
    }
  });

  Venue.find({})
    .sort(sort)
    .skip(page * pageSize)
    .limit(_.toNumber(pageSize))
    .exec(function (err, venues) {
      if (err) {
        debug(err);
        res.status(500).send({ message: 'db error' });
      }
      var result = venues ? venues : [];
      Q.when(deferred.promise, function (total) {
        res.set('X-Total-Elements', total);

        res.set('X-Page-Size', pageSize);
        res.set('X-Page', page + 1);
        res.send(result);
      });
    });
}

function create(req, res) {
  var Venue = new Venue(req.body);
  venue.save(function (err, savedVenue) {
    if (err) {
      debug(err);
      res.status(500).send({ message: 'db error' });
    }
    res.send(savedVenue);
  })
}

function update(req, res) {
  var venue = req.body;
  Venue.findById(venue._id, function (err, result) {
    if (err) {
      debug(err);
      res.status(500).send({ message: 'db error' });
    }
    result = _.assignIn(result, venue);
    result.save(function (err) {
      if (err) {
        debug(err);
        res.status(500).send({ message: 'db error' });
      } else {
        res.send(result);
      }
    });
  });
}

function get(req, res) {
  var venueId = req.venueId;
  Venue.findById(venueId, function (err, venue) {
    if (err) {
      debug(err);
      res.status(500).send({ message: 'db error' });
    }
    if (!venue) {
      res.status(404).send({ message: 'Venue not found' });
    } else {
      res.send(venue);
    }
  });
}
function remove(req, res) {
  var venueId = req.venueId;
  Venue.findById(venueId, function (err, venue) {
    if (err) {
      debug(err);
      res.status(500).send({ message: 'db error' });
    }
    if (!venue) {
      res.status(404).send({ message: 'Venue not found' });
    } else {
      venue.remove(function (err) {
        if (err) {
          debug(err);
          res.status(500).send({ message: 'db error' });
        }
        res.send({ message: 'ok' });
      });
    }
  });
}
module.exports = {
  all: all,
  create: create,
  get: get,
  remove: remove,
  update: update,
  search: search(Venue)
};
