import request from 'request';
import tokenize from './../utils/tokenize';
import compareTokens from './../utils/compareTokens';
import getOutletID from './getOutletID';

const requestArticle = async function (sourceArticle, source) {
    return new Promise(async(resolve, reject) => {
        try {
            const keywords = tokenize(sourceArticle.title, { returnType: "url" });
            let outletID = await getOutletID(source);
            request(`https://newsapi.org/v2/everything?q=${keywords}&sources=${outletID}&apiKey=${process.env.NEWS_API_KEY}`,
                function(err, response, body) {
                    if (err) {
                        reject(err);
                    }

                    if (response.statusCode === 200) {
                        body = JSON.parse(body);
                        let articles = body.articles;

                        // Keep only those article whose source name is the same and title matches
                        articles = articles.filter(function(article) {
                            if (article.source.name === source && compareTokens(article.title, sourceArticle.title) >= 0.2) {
                                return article;
                            }
                        });

                        // Check if articles with specified conditions exist
                        if (articles.length) {
                            resolve(articles);
                        } else {
                            reject("No articles found!");
                        }
                    }
                }
            );
        } catch(err) {
            reject(err);
        }
    });
}

export default requestArticle;