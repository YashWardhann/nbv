// Fetches an article from news-json api 
// which has a different political leaning 
// than the one given
import MediaListing from '../models/media-model';
import logger from '../config/winston';
import shuffleArray from './../utils/shuffle';
import compareTokens from './../utils/compareTokens';
import requestArticle from './requestArticle';

const fetchArticle = async (sourceArticle, sourceBias) => {
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
        const newArticle = { };

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
            docs = docs.map(doc => doc.name);

            // Shuffle the docs array for extra randomness 
            docs = shuffleArray(docs);
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
                    if (similarArticles.length == 4) {
                        break;
                    }
                } catch (err) {
                    logger.error(`No articles found for ${doc}`);
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