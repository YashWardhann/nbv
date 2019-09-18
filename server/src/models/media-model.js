const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mediaSchema = new Schema({
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

const MediaOutlet = mongoose.model('MediaListing', mediaSchema);

module.exports = MediaOutlet;