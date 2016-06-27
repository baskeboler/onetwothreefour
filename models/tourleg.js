var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Band = require('./band');

var TourLegSchema = new Schema({
    bandId: ObjectId,
    city: String,
    country: String,
    start: Date,
    end: Date,
    created: Date,
    modified: Date
});

TourLegSchema.pre('save', function (next) {
    if (!this.created) {
        this.created = new Date();
    }
    this.modified = new Date();
    Band.findById(this.bandId, function (err, band) {
        if (err) {
            next(err)
        } else {
            if (band) {
                next();
            } else {
                next(new Error('band does not exist'));
            }
        }
    });
});

var TourLegModel = mongoose.model('TourLeg', TourLegSchema);

module.exports = TourLegModel;
