require('./init_mongo');
var csv = require('csv-parse');
var fs = require('fs');
var Venue = require('./models/venue');
var _ = require('lodash');

var parser = csv({ delimiter: ';' }, function (err, data) {
    if (err) {
        console.log(`error: ${err}`);
    } else {
        // data.pop();
        _.each(data, function (r) {
            var v = {};
            v.name = r[3];
            v.location = {
                type: 'Point',
                coordinates: []
            };
            v.location.coordinates.push(parseFloat(_.replace(r[0], ",", ".")));
            v.location.coordinates.push(parseFloat(_.replace(r[1], ",", ".")));
            v.capacity =  _.toNumber(r[7]);
            if (_.isNaN(v.capacity)) {
                v.capacity = undefined;
            }
            console.log(`${JSON.stringify(v)}`);
            var venue = new Venue(v);
            venue.save(function (err) {
                if (err) {

                    console.log(`error: ${err}`);
                }
            });

        });
        // console.log(data);
    }
});

fs.createReadStream(__dirname + '/registro-locales-bailables.csv').pipe(parser);
