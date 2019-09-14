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

            console.log(docs);

            let similarArticles = [];
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

                    similarArticles.push(match);

                    // Ensure four articles have been selected
                    if (similarArticles.length >= 4) {
                        break;
                    }
                } catch (err) {
                    logger.info(`No articles found for ${doc}`);
                    continue;
                } finally {
                    console.log(similarArticles);
                }
            }

            const article = similarArticles[Math.floor(Math.random() * similarArticles.length)];

            resolve({
                title: article.title,
                url: article.url
            });

        });

    })
}

export default fetchArticle;