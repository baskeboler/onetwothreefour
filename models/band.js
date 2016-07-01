var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BandSchema = new Schema({
  name: {
    type: String,
    text: true
  },
  email: {
    type: String,
    text: true
  },
  city: {
    type: String,
    text: true
  },
  country: {
    type: String,
    text: true
  },
  neighbourhood: String,
  bio: {
    type: String,
    text: true
  },
  pictures: [Schema.Types.ObjectId],
  homepage: String,
  facebook: String,
  twitter: String,
  active: Boolean,
  created: Date,
  modified: Date
});

BandSchema.pre('save', function (next) {
  if (!this.created) {
    this.created = new Date();
  }
  this.modified = new Date();
  next();
});

var BandModel = mongoose.model('Band', BandSchema);

module.exports = BandModel;
