// Fetches an article from news-json api 
// which has a different political leaning 
// than the one given

import MediaListing from '../models/media-model';
import logger from '../config/winston';
import request from 'request';
import tokenize from './../utils/tokenize';
import { JaroWinklerDistance } from 'natural';
import { parseString } from 'xml2js';
import shuffleArray from './../utils/shuffle';
import compareTokens from './../utils/compareTokens';

const fetchArticle =  async (sourceArticle, sourceBias) => {
    return new Promise((resolve, reject) => {
        const scores = new Map([
            ['left', -2],
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
            let keywords_url = tokenize(sourceArticle.title, { returnType: 'url' });
                  
            // Shuffle the dbSources array for extra randomness 
            dbSources = shuffleArray(dbSources);

            let source = dbSources[Math.floor(Math.random() * dbSources.length)];             
            request(`https://news.google.com/rss/search?q=${keywords_url}+${ encodeURIComponent(source)}`, function(err, response, body) {
                if(response.statusCode === 200 && !err) {  
                    // Convert RSS feed to JSON format
                    parseString(body, function(err,result) {
                        if (err) reject(err);
                         if (result.rss.channel[0].item) {
                            let items = shuffleArray(result.rss.channel[0].item);
                            for (let j = 0; j < items.length; j++) {
                                // Select an article whose source name matches the most to the fetched sources from the DB 
                                if (typeof items[j].source !== undefined) {
                                    if (JaroWinklerDistance(items[j].source[0]._, source, undefined, true) >= 0.5) {
                                        newArticle.title = items[j].title[0];
                                       
                                        // Returns a boolean which indicates if the keywords of the 
                                        // source article and new article are similar or not
                                        if(compareTokens(sourceArticle.title, newArticle.title)) {
                                            newArticle.source = source;
                                            newArticle.link = items[j].link[0];
                                            resolve(newArticle);     
                                        }
                                        break; // Break the inner loop                            
                                    }
                                }
                            }
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
