require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VenueSchema = new Schema({
  name: {
    type: String,
    text: true
  },
  location: Schema.Types.Point,
  phone: String,
  capacity: Number,
  created: Date,
  modified: Date
});
VenueSchema.index({
  'location': '2dsphere'
});
VenueSchema.pre('save', function (next) {
  if (!this.created) {
    this.created = new Date();
  }
  this.modified = new Date();
  next();
});

var VenueModel = mongoose.model('Venue', VenueSchema);
VenueModel.ensureIndexes();

module.exports = VenueModel;
