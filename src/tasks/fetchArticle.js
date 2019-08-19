// Fetches an article from news-json api 
// which has a different political leaning 
// than the one given

import MediaListing from '../models/media-model';
import logger from '../config/winston';
import request from 'request';
import tokenize from './../utils/tokenize';
import { JaroWinklerDistance } from 'natural';
import { parseString } from 'xml2js';

const fetchArticle =  async (sourceArticle, sourceBias) => {
    return new Promise((resolve, reject) => {
        const scores = new Map([
            ['Left', -2],
            ['left-center', -1],
            ['center', 0],
            ['right-center', 1],
            ['right', 2]        
        ]);
    
        const sourceScore = scores.get(sourceBias);
        
        // Stoes the new article fetched from Google News 
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
            
            // Get tokens from the title in url format
            let keywords = tokenize(sourceArticle.title, { returnType: 'url' });
            let break_loop = 0; 
    
            for (let i = 0; i < dbSources.length && !break_loop; i++) {
                let source = dbSources[i];
             
                request(`https://news.google.com/rss/search?q=${[...keywords, ...source].join('+')}`, function(err, response, body) {
                    if(response.statusCode === 200 && !err) {  
                        
                        // Convert RSS feed to JSON format
                        parseString(body, function(err,result) {
                            const items = result.rss.channel[0].item;
                            if (items) {
                                for (let j = 0; j < items.length; j++) {
                                    // Select an article whose source name matches the most to the fetched sources from the DB 
                                    if (JaroWinklerDistance(items[j].source[0]._, source, undefined, true) >= 0.9) {
                                        console.log(':)');
                                        newArticle.title = items[j].title[0];
                                        newArticle.source = source;
                                        newArticle.link = items[j].link[0]
                                        resolve(newArticle);
                                        break; // Break the above loop
                                        break_loop++; // Break the top most for loop
                                    }
                                }
                            } else {
                                reject('No sources found!');
                            }
                        });
                    } else {
                        logger.error(err);
                    }
                });
            }

        });
    
    })


}

export default fetchArticle;
