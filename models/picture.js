var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crate = require('mongoose-crate'),
    Cloudinary = require('mongoose-crate-cloudinary'),
    config = require('../config/config');

var PictureSchema = new Schema({
    reference: Schema.Types.ObjectId,
    created: Date,
    caption: String
});

var cloudinaryStorage = new Cloudinary(config.cloudinary    );

PictureSchema.plugin(crate, {
    storage: cloudinaryStorage,
    fields: {
        image: { }
    }
});

var PictureModel = mongoose.model('Picture', PictureSchema);

module.exports = PictureModel;