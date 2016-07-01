var Band = require('../models/band');
var Picture = require('../models/picture');
var debug = require('debug')('onetwothreefour:band-controller');
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
  });
}
function uploadPicture(req, res, next) {
  var bandId = req.bandId;
  var picture = new Picture({
    reference: bandId
  });
  debug('upload request');
  debug(`reference=${bandId}`);
  picture.attach('image', req.files.image[0], (err) => {
    if (err) return next(err);
    picture.save((err, picture) => {
      if (err) return next(err);
      Band.findById(bandId, (err, band) => {
        if (err) return next(err);
        if (!band.pictures) band.pictures = [];
        band.pictures.push(picture.id);
        band.save((err, savedBand) => {
          if (err) return next(err);
          res.send(savedBand);
        });
      });
    });
  });
}

function getPicture(req, res, next) {
  var bandId = req.bandId;
  var pictureIndex = req.pictureIndex;
  var size = req.query.size || 'original'; //original, small, medium
  Band.findById(bandId, (err, band) => {
    if (err) return next(err);
    if (pictureIndex>= band.pictures.length) return next('invalid index');
    var pictureId = band.pictures[pictureIndex];
    Picture.findById(pictureId, (err, picture) => {
      if (err) return next(err);
      res.sendFile(picture.image[size].url);
    });
  });
}

function removePicture(req, res, next) {
  var bandId = req.bandId;
  var pictureIndex = req.pictureIndex;
  Band.findById(bandId, (err, band) => {
    if (err) return next(err);
    if (pictureIndex>= band.pictures.length) return next('invalid index');
    var pictureId = band.pictures[pictureIndex];
    debug(`pictureId: ${pictureId}`);
    debug(`pictures before splice: ${band.pictures}`);
    band.pictures.splice(pictureIndex, 1);
    debug(`pictures after splice: ${band.pictures}`);
    debug(`removed index ${pictureIndex} from pictures`);
    band.save((err) => {
      if (err) return next(err);
      debug(`saved band with pictures ${band.pictures}`);
      Picture.findById(pictureId, (err, picture) => {
        if (err) return next(err);
        picture.remove((err) => {
          if (err) return next(err);
          res.send(band);
        });
      });
    });
  });
}
function update(req, res) {
  var band = req.body;
  Band.findById(band._id, (err, result) => {
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
  update: update,
  uploadPicture: uploadPicture,
  getPicture: getPicture,
  removePicture: removePicture,
  search: search(Band)
};
