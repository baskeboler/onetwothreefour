var fs = require('fs');
var debug = require('debug')('onetwothreefour:loadCountries');
var _ = require('lodash');

debug('loading countries.');
var data = fs.readFileSync('countries.json');
debug('file read, parsing contents.');
var fullCountryData = JSON.parse(data);
debug(`file parsed, ${fullCountryData.length} countries loaded`);
// debug(JSON.stringify(fullCountryData));

module.exports = fullCountryData;