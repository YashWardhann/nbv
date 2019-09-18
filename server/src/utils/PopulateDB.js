const Media = require('../models/media-model');
const list = require('../data/biases');
const mongoose = require('mongoose');
const request = require('request');

function PopulateDB(data) {
    return new Promise(async (resolve, reject) => {
        try {
            // Clear out all the records
            Media.deleteMany({}, 
                function(err) {
                if (err) {
                    reject(err);
                }
            });
            for (let i = 0; i < data.length; i++) {
                let bias = data[i].x > 6 ? (data[i].x >= 18 ? "right" : "right-center") : (data[i].x < -6 ? (data[i].x <= -18 ? "left" : "left-center") : "center");
                let listing = new Media({
                    name: data[i].name, 
                    bias: bias, 
                    params: {
                        x: data[i].x, 
                        y: data[i].y, 
                        api_avail: data[i].api_avail,
                        region: {
                            region_name: 'Worldwide', 
                            isLocked: 0
                        }
                    }
                });

                listing.save();
            }

            resolve();
        } catch(err) {
            reject(err);
        }
    });
}

// Connect to mongoDB 
// Connect to mongodb 
mongoose.connect('mongodb://admin:admin12@ds243897.mlab.com:43897/news-bias', {
    useNewUrlParser: true
})
.then(() => {
    console.log('Connected to mongodb');
    PopulateDB(list)
      .then(() => console.log('Populated Database'))
      .catch(err => console.error(err));
}) 
.catch((err) => {
    console.error(err);
});


