// Fetches an article from news-json api 
// which has a different political leaning 
// than the one given

import MediaListing from '../models/media-model';
import request from 'request';

const fetchArticle =  async sourceBias => {
    return new Promise((resolve, reject) => {
        const scores = new Map([
            ['left', -2],
            ['leftcenter', -1],
            ['center', 0],
            ['rightcenter', 1],
            ['right', 2]        
        ]);
    
        const sourceScore = scores.get(sourceBias);
    
        const newArticle = {
            url: undefined, 
            bias: null
        };
    
        // Get the required bias for the new article
        for (let [key, score] of scores) {
            if (score == sourceScore * -1) {
                newArticle.bias = key;
            } 
        }
    
        // Get a random publisher based on the required bias
        MediaListing.find({
            bias: newArticle.bias
        }, function(err, docs) {
            if (err) reject(err);
    
            newArticle.url = docs[Math.floor(Math.random() * docs.length)].name;
            resolve(newArticle);
        });
    
    })


}

export default fetchArticle;
