// Fetches an article from news-json api 
// which has a different political leaning 
// than the one given

import MediaListing from '../models/media-model';
import logger from '../config/winston';
import request from 'request';
import tokenize from './../utils/tokenize';
import async from 'async';
import { JaroWinklerDistance } from 'natural';
import { parseString } from 'xml2js';
import shuffleArray from './../utils/shuffle';
import compareTokens from './../utils/compareTokens';

const requestArticle = async function(sourceArticle, source) {
    return new Promise((resolve, reject) => {
        request(`https://newsapi.org/v2/everything?q=trump+el+paso&domains=foxnews.com&apiKey=17279e5e52c04dc1a189434c07aab8df`, function(err, response, body) {
            if (err) { reject(err); }

            if (response.statusCode === 200) {
                body = JSON.parse(body);
                let articles = body.articles;
              
                // Keep only those article whose source name is the same and title matches 
                articles = articles.filter(function(article) {
                    console.log(article.source.name, source);
                    if (article.source.name === source && compareTokens(article.title, sourceArticle.title) >= 0.2) {
                        return article;
                    }
                });
                
                // Check if articles with specified conditions exist
                if (articles.length) {
                    resolve(articles);
                } else {
                    reject('No articles found!');
                }
                
            }
        });
    });
}

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
            } 
        }

        // Get a random publisher based on the required bias
        MediaListing.find({
            bias: newArticle.bias
        }, async function(err, docs) {
            for (let doc of docs) {
                dbSources.push(doc.name);
            }
            
            // Shuffle the dbSources array for extra randomness 
            dbSources = shuffleArray(dbSources);   

            // Get tokens from the title in url format
            let keywords_url = tokenize(sourceArticle.title, { returnType: 'url' });

            let similarArticles = [];
            
            for (let source of dbSources) {
                try {
                    const articles = await requestArticle(sourceArticle, source);
                    console.log(articles);
                    const match = articles.reduce(function(prev, current) {
                        if (compareTokens(prev.title, sourceArticle.title) > compareTokens(current.title, sourceArticle.title)) {
                            return prev;
                        } else {
                            return current;
                        }
                    });

                    similarArticles.push(match);
                    break;
                } catch (err) {
                    logger.error('No articles found!');
                    continue;
                } finally {
                    console.log(similarArticles);
                }
            }

            resolve({
                title: undefined, 
                url: undefined
            });

        });
 
    })
}

export default fetchArticle;
