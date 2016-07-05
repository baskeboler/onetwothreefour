require('mongoose-geojson-schema');
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
  modified: Date,
  lastCheckIn: {
    location: Schema.Types.Point,
    date: Date
  },
  pastLocations: [{
    location: Schema.Types.Point,
    date: Date
  }]
});
BandSchema.index({ name: 'text', email: 'text', city: 'text', country: 'text', bio: 'text' });
BandSchema.index({ 'lastCheckIn.location': '2dsphere' });
BandSchema.pre('save', function (next) {
  var self = this;
  if (!this.created) {
    this.created = new Date();
    this.pastLocations = [];
  }
  this.modified = new Date();
  if (this.isModified('lastCheckIn')) {
    this.lastCheckIn.date = this.modified;
    this.model('Band').findById(this.id, (err, doc) => {
      if (doc.lastCheckIn) {
        self.pastLocations.push(doc.lastCheckIn);
      }
      next();
    });
  } else next();
});


var BandModel = mongoose.model('Band', BandSchema);
BandModel.ensureIndexes();
module.exports = BandModel;
