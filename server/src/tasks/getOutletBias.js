import MediaListing from './../models/media-model';
import { JaroWinklerDistance } from 'natural';

// Fetches the bias from the media outlet database for
// a media outlet whose name is most similar to that of 
// the source article. This is done as URLs are in a 
// different format as compared to the records in the 
// database. 
//
// For eg: thehindu is the URL whereas The Hindu is the 
// name

const getOutletBias = async function(sourceArticle) {
    return new Promise((resolve, reject) => {
       
        // Get list of all media outlets by creating a new regular expression 
        // to get all media outlets starting from the same letter as that
        // of the source articles url
        MediaListing.find({
            name: {
                $regex: new RegExp('^' + sourceArticle.url[0]), 
                $options: "i"
            }
        }, 
        function(err, docs) {
            if(err) {
                reject(err);
                throw new Error(err);
            } else {
                // Initialize an empty object to store 
                // the matched record
                let matched = {
                    distance: 0
                };

                // Store the media outlets information whose name is most similar to that 
                // of the publisher of the source article
                docs.forEach(function(doc) {
                    let distance = JaroWinklerDistance(doc.name, sourceArticle.url, undefined, true);   
                    if (distance >= matched.distance) {
                        matched.name = doc.name; 
                        matched.bias = doc.bias;
                        matched.distance = distance;
                    }
                });
                resolve(matched.bias);                
            }
        });
    })
}

export default getOutletBias;