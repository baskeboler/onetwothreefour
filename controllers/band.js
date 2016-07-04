var Band = require('../models/band');
var Picture = require('../models/picture');
var debug = require('debug')('onetwothreefour:band-controller');
var _ = require('lodash');
var Q = require('q');
var search = require('./search');
var cloudinary = require('cloudinary');

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
    if (err) return handleError(err, res);
    picture.save((err, picture) => {
      if (err) return handleError(err, res);
      Band.findById(bandId, (err, band) => {
        if (err) return handleError(err, res);
        if (!band.pictures) band.pictures = [];
        band.pictures.push(picture.id);
        band.save((err, savedBand) => {
          if (err) return handleError(err, res);
          res.send(savedBand);
        });
      });
    });
  });
}

function getPicture(req, res, next) {
  var bandId = req.bandId;
  var pictureId = req.pictureId;
  var size = req.query.size || 'original'; //original, small, medium
  var imgOpts = {
    secure: req.secure
  };
  if (size == 'small') {
    imgOpts.width=100;
    imgOpts.height=150;
    imgOpts.crop = 'fill';
  } else if (size == 'medium') {
    imgOpts.width=250;  
    imgOpts.height=300;
    imgOpts.crop = 'fill';
  }
  Band.findById(bandId, (err, band) => {
    if (err) {
      handleError(err, res);
    } else {
      var f = _.find(band.pictures, function (id) {
        debug(`comparing ${id} with ${pictureId}`);
        var comparison = id == pictureId;
        debug(`comparison is ${comparison}`);
        return comparison;
      });
      debug(`find returned ${f}`);
      if (f) {
        Picture.findById(pictureId, (err, picture) => {
          if (err) return handleError(err, res);
          var url = cloudinary.url(picture.image.url, imgOpts);
          res.redirect(url);
        });
      } else {
        res.status(404).send({message: 'picture not found'});
      }

    }
  });
}

function handleError(err, res) {
  debug(`error: ${err.message}`);
  res.status(500);
  res.send({ message: err.message });
}

function removePicture(req, res, next) {
  var bandId = req.bandId;
  var pictureId = req.pictureId;
  Band.findById(bandId, (err, band) => {
    if (err) return handleError(err);
    else {
      debug(`pictureId: ${pictureId}`);
      var f = _.find(band.pictures, function (id) {
        debug(`comparing ${id} with ${pictureId}`);
        var comparison = id == pictureId;
        debug(`comparison is ${comparison}`);
        return comparison;
      });
      debug(`find returned ${f}`);
      if (f) {
        debug(`pictures before pull: ${band.pictures}`);
        // _.pull(band.pictures, pictureId);
        band.pictures = _.filter(band.pictures, (p) => {
          return p != pictureId;
        });
        // band.pictures.splice(pictureIndex, 1);
        debug(`pictures after pull: ${band.pictures}`);
        debug(`removed id ${pictureId} from pictures`);
        band.save((err) => {
          if (err) return handleError(err, res);
          debug(`saved band with pictures ${band.pictures}`);
          Picture.findById(pictureId, (err, picture) => {
            if (err) return handleError(err, res);
            picture.remove((err) => {
              if (err) return handleError(err, res);
              res.send(band);
            });
          });
        });
      } else res.status(404).send({message: 'picture not found'});
    }
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
