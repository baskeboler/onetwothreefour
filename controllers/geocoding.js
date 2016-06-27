const url = require('url');
const _ = require('lodash');
var http = require('http');
var debug = require('debug')('onetwothreefour:geocoding-controller');

function defaultOptions() {
    return {
        protocol: 'http:',
        hostname: 'nominatim.openstreetmap.org',
        pathname: '/search',
        query:  {
            format: 'json'
        }
    };
}

function buildSearchCityUrl(city) {
    var opts = _.assign({}, defaultOptions());
    opts.query.city = city;
    opts.query.addressdetails = 1;
    return url.format(opts);  
}

function buildSearchCountryUrl(country) {
    var opts = _.assign({},  defaultOptions());
    opts.query.country = country;
    opts.query.addressdetails = 1;
    return url.format(opts);  
}

function buildReverseSearchUrl(lat, lng) {
    var opts = _.assign({}, defaultOptions());
    opts.pathname = '/reverse';
    opts.query.lat = lat;
    opts.query.lon = lng; // different names for longitude in leaflet and nominatim
    return url.format(opts);
}

function city(req, res) {
    var city = req.city;
    var url = buildSearchCityUrl(city);
    debug(`querying city at ${url}`);
    http.get(url, (geores) => {
        var body = '';
        geores.on('data', (d) => {  
            body += d;
        });
        geores.on('end', () => {
            debug(`got response: ${body}`);
            var responseObject = JSON.parse(body);
            res.send(responseObject);
        });
        geores.on('error', (error) => {
            debug(`error querying city: ${error.message}`);
            res.status(500).send({message: 'error querying city', detail: error.message});
        });
    });
}

function country(req, res) {
    var country = req.country;
    var url = buildSearchCountryUrl(country);
    debug(`querying country at ${url}`);
    http.get(url, (response) => {
        var body = '';
        response.on('data', (d) =>  {   
            body += d;
        });
        response.on('end', () => {
            debug(`got response: ${body}`);
            var responseObject = JSON.parse(body);
            res.send(responseObject);
        });
        response.on('error', (error) => {
            debug(`error querying country: ${error.message}`);
            res.status(500).send({message: 'error querying country', detail: error.message});
        });
    });
}

function reverse(req, res) {
    var lat = req.lat,
        lng = req.lng,
        url = buildReverseSearchUrl(lat, lng);

    debug(`querying reverse geocoding at url: ${url}`);
    http.get(url, (response) => {
        var body = '';
        response.on('data', (data) => {
            body += data;
        });
        response.on('end', () => {
            debug(`got response: ${body}`);
            var responseObject = JSON.parse(body);
            res.send(responseObject);
        });
        response.on('error', (error) => {
            debug(`error querying reverse geocode: ${error.message}`);
            res.status(500).send({message: 'error querying reverse geocode', detail: error.message});
        });
    });
}

module.exports = {
    city: city,
    country: country,
    reverse: reverse
};