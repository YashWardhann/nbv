'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mediaSchema = new Schema({
    name: String,
    bias: String,
    params: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        api_avail: { type: Boolean, default: 1 },
        region: {
            region_name: { type: String, default: 'Worldwide' },
            isLocked: { type: Boolean, default: 0 }
        }
    }
});

var MediaOutlet = mongoose.model('MediaListing', mediaSchema);

module.exports = MediaOutlet;
//# sourceMappingURL=media-model.js.map