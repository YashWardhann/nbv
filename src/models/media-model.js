const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    name: String, 
    bias: String
});

const MediaOutlet = mongoose.model('MediaListing', mediaSchema);

module.exports = MediaOutlet;