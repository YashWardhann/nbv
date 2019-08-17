// Fetches an article from news-json api 
// which has a different political leaning 
// than the one given

import MediaListing from '../models/media-model';
import logger from '../config/winston';
import request from 'request';
import { JaroWinklerDistance } from 'natural';
import { parseString } from 'xml2js';

const fetchArticle =  async sourceBias => {
    return new Promise((resolve, reject) => {
        const scores = new Map([
            ['Left', -2],
            ['leftcenter', -1],
            ['center', 0],
            ['right-center', 1],
            ['right', 2]        
        ]);
    
        const sourceScore = scores.get(sourceBias);
            
        const newArticle = {
            title: undefined,
            source: undefined, 
            bias: null, 
            link: undefined
        };

        // Get the required bias for the new article
        for (let [key, score] of scores) {
            if (score == sourceScore * -1) {
                newArticle.bias = key;
                console.log(key);
            } 
        }

        // Get a random publisher based on the required bias
        MediaListing.find({
            bias: newArticle.bias
        }, function(err, docs) {
            let dbSources = [];
            for (let doc of docs) {
                dbSources.push(doc.name);
            }

            let keywords = ['israel', 'usa', 'congress reps'];
            let source = [dbSources[Math.floor(Math.random() * dbSources.length)]]
            console.log(source);
 
            request(`https://news.google.com/rss/search?q=${[...keywords, ...source].join('+')}`, function(err, response, body) {
                if(response.statusCode === 200 && !err) {               
                    let matchedSources = [];

                    parseString(body, function(err,result) {
                        const items = result.rss.channel[0].item;
                      
                        if (items) {
                            newArticle.title = items[0].title[0];
                            newArticle.source = source;
                            newArticle.link = items[0].link[0]
                            resolve(newArticle);
                        } else {
                            reject('No sources found!');
                        }
                    });
                } else {
                    logger.error(err);
                }
            });
        });
    
    })


}

export default fetchArticle;
