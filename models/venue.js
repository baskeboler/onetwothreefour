var mongoose = require('mongoose');
var GeoJson = require('mongoose-geojson-schema');

var Schema = mongoose.Schema;

var VenueSchema = new Schema({
  name: {
    type: String,
    text: true
  },
  location: Schema.Types.Point,
  phone: String,
  capacity: Number
});

var VenueModel = mongoose.model('Venue', VenueSchema);

module.exports = VenueModel;
