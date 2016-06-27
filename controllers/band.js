var Band = require('../models/band');
var debug = require('debug')('onetwothreefour:band-controller');
var _ = require('lodash');
var Q = require('q');

function all(req, res) {
  var page = req.query.page || 1,
    pageSize = req.query.pageSize || 10,
    sort = req.query.sort || 'name',
    deferred = Q.defer();
  page--;
  debug(`page=${page}, pageSize=${pageSize}, sort=${sort}`);
  Band.count({}, function (err, total) {
    if (err) {
      deferred.resolve(0);
    } else {
      deferred.resolve(total);
    }
  });
  Band.find({})
    .sort(sort)
    .skip(page * pageSize)
    .limit(pageSize)
    .exec(function (err, bands) {
      if (err) {
        debug(err);
        res.status(500).send({ message: 'db error' });
      }
      var result = bands ? bands : [];
      Q.when(deferred.promise, function (total) {
        res.set('X-Total-Elements', total);
        res.set('X-Page-Size', pageSize);
        res.set('X-Page', page + 1);
        res.send(result);
      });
    });
}

function create(req, res) {
  var band = new Band(req.body);
  band.save(function (err, savedBand) {
    if (err) {
      debug(err);
      res.status(500).send({ message: 'db error' });
    }
    res.send(savedBand);
  })
}

function update(req, res) {
  var band = req.body;
  Band.findById(band._id, function (err, result) {
    if (err) {
      debug(err);
      res.status(500).send({ message: 'db error' });
    }
    result = _.assignIn(result, band);
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
  var bandId = req.bandId;
  Band.findById(bandId, function (err, band) {
    if (err) {
      debug(err);
      res.status(500).send({ message: 'db error' });
    }
    if (!band) {
      res.status(404).send({ message: 'Band not found' });
    } else {
      res.send(band);
    }
  });
}
function remove(req, res) {
  var bandId = req.bandId;
  Band.findById(bandId, function (err, band) {
    if (err) {
      debug(err);
      res.status(500).send({ message: 'db error' });
    }
    if (!band) {
      res.status(404).send({ message: 'Band not found' });
    } else {
      band.remove(function (err) {
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
  update: update
};
