var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crate = require('mongoose-crate'),
    LocalFS = require('mongoose-crate-localfs'),
    GraphicsMagick = require('mongoose-crate-gm'),
    config = require('../config/config');

var PictureSchema = new Schema({
    reference: Schema.Types.ObjectId,
    created: Date,
    caption: String
});

PictureSchema.plugin(crate, {
    storage: new LocalFS({
        directory: config.uploadsDir
    }),
    fields: {
        image: {
            processor: new GraphicsMagick({
                tmpDir: config.tmpDir, // Where transformed files are placed before storage, defaults to os.tmpdir()
                imageMagick: true,
                formats: ['JPEG', 'GIF', 'PNG'], // Supported formats, defaults to ['JPEG', 'GIF', 'PNG', 'TIFF']
                transforms: {
                    original: {
                        // keep the original file
                        format: '.jpg'
                    },
                    small: {
                        thumbnail: '150x150',
                        format: '.jpg'
                    },
                    medium: {
                        thumbnail: '250x250',
                        format: '.jpg'
                    }
                }
            })
        }
    }
});

var PictureModel = mongoose.model('Picture', PictureSchema);

module.exports = PictureModel;