import request from 'request';
import tokenize from './../utils/tokenize';

const requestArticle = async function (sourceArticle, source) {
    return new Promise((resolve, reject) => {
        const keywords = tokenize(sourceArticle.title, { returnType: "url" });

        request(`https://newsapi.org/v2/everything?q=${keywords}&domains=${source.domain}&apiKey=${process.env.NEWS_API_KEY}`,
            function(err, response, body) {
                if (err) {
                    reject(err);
                }

                if (response.statusCode === 200) {
                    body = JSON.parse(body);
                    let articles = body.articles;

                    // Keep only those article whose source name is the same and title matches
                    articles = articles.filter(function(article) {
                        console.log(article.source.name, source);
                        if (
                            article.source.name === source &&
                            compareTokens(article.title, sourceArticle.title) >= 0.2
                        ) {
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
    });
}

export default requestArticle;