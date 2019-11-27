import MediaListing from '../models/media-model';
import logger from '../config/winston';
import shuffleArray from './../utils/shuffle';
import compareTokens from './../utils/compareTokens';
import requestArticle from './requestArticle';

// Fetches an array of articles from news-json api 
// which has a different political leaning 
// than the one given

const fetchArticle = async (sourceArticle, sourceBias) => {
    return new Promise((resolve, reject) => {        
        // Get the bias of the new article based
        // on the bias of the source article
        const scores = new Map([
            ['left', -2],
            ['left-center', -1],
            ['center', 0],
            ['right-center', 1],
            ['right', 2]
        ]);
    
        const sourceScore = scores.get(sourceBias);

        // Stoes the new article fetched from Google News 
        const newArticle = { };
        for (let [key, score] of scores) {
            if (score == sourceScore * -1) {
                newArticle.bias = key;
            }
        }
        // Get an array of random media outlets 
        MediaListing.find({
            bias: newArticle.bias
        }, async function(err, docs) {
            docs = docs.filter(doc => doc.params.api_avail)
                    .map(doc => doc.name);

            // Shuffle the docs array for extra randomness 
            docs = shuffleArray(docs);
            let payload = [];
            for (let doc of docs) {
                try {
                    console.log('Processing for', doc);
                    const articles = await requestArticle(sourceArticle, doc);
                    const match = articles.reduce(function(prev, current) {
                        if (compareTokens(prev.title, sourceArticle.title) > compareTokens(current.title, sourceArticle.title)) {
                            return prev;
                        } else {
                            return current;
                        }
                    });
                    payload.push(match);
                    // Ensure four articles have been selected
                    if (payload.length > 3) {
                        break;
                    }
                } catch (err) {
                    logger.info(`No articles found for ${doc}`);
                    continue;
                } finally {
                    console.log(payload);
                }
            }
            console.log(payload);
            if (payload.length > 0 && 'title' in payload[0]) {
                resolve({
                    status: 200,
                    title: payload[0].title,
                    url: payload[0].url,
                    bias: newArticle.bias
                });
            } else {
                resolve({
                    status: 418, // Switch to localized server 
                    error: 'No articles found'
                });
            }
        });
    })
}

export default fetchArticle;