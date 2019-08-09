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
            let dbSources = [];
            for (let doc of docs) {
                dbSources.push(doc.name);
            }
            request('https://newsapi.org/v2/sources?language=en&apiKey=17279e5e52c04dc1a189434c07aab8df', function(err, response, body) {
                if(response.statusCode === 200 && !err) {
                    body = JSON.parse(body);
                    let apiSources = [];
                    for(let source of body.sources) {
                        apiSources.push(source.name);
                    }

                    dbSources = dbSources.filter(dbSource => apiSources.indexOf(dbSource) !== -1);

                    console.log(dbSources);
                    
                }
            });
        });
    
    })


}

export default fetchArticle;
