var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BandSchema = new Schema({
  name: String,
  email: String,
  city: String,
  country: String,
  neighbourhood: String,
  bio: String,
  pictures: [Schema.Types.ObjectId],
  homepage: String,
  facebook: String,
  twitter: String,
  active: Boolean,
  created: Date,
  modified: Date
});

BandSchema.pre('save', function(next) {
  if (!this.created) {
    this.created = new Date();
  }
  this.modified = new Date();
  next();
});

var BandModel = mongoose.model('Band', BandSchema);

module.exports = BandModel;
