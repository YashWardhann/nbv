// Fetches an article from news-json api
// which has a different political leaning
// than the one given

import MediaListing from "../models/media-model";
import logger from "../config/winston";
import request from "request";
import tokenize from "./../utils/tokenize";
import shuffleArray from "./../utils/shuffle";
import compareTokens from "./../utils/compareTokens";

async function requestArticle(sourceArticle, source) {
  return new Promise((resolve, reject) => {
    const keywords = tokenize(sourceArticle.title, { returnType: "url" });

    request(
      `https://newsapi.org/v2/everything?q=${keywords}&domains=${source.domain}&apiKey=${process.env.NEWS_API_KEY}`,
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

const fetchArticle = async (sourceArticle, sourceBias) => {
  return new Promise((resolve, reject) => {
    const scores = new Map([
      ["left", -2],
      ["left-center", -1],
      ["center", 0],
      ["right-center", 1],
      ["right", 2]
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
    MediaListing.find(
      {
        bias: newArticle.bias
      },
      async function(err, docs) {
        docs = docs.map(doc => doc.name);

        // Shuffle the docs array for extra randomness
        docs = shuffleArray(docs);

        let similarArticles = [];

        for (let doc of docs) {
          try {
            const articles = await requestArticle(sourceArticle, doc);
            console.log(articles);
            const match = articles.reduce(function(prev, current) {
              if (
                compareTokens(prev.title, sourceArticle.title) >
                compareTokens(current.title, sourceArticle.title)
              ) {
                return prev;
              } else {
                return current;
              }
            });

            similarArticles.push(match);

            // Ensure two articles have been selected
            if (similarArticles.length == 2) {
              break;
            }
          } catch (err) {
            logger.error("No articles found!");
            continue;
          } finally {
            console.log(similarArticles);
          }
        }

        const article = similarArticles[Math.floor(Math.random() * similarArticles.length)];

        resolve({
          title: article.length,
          url: article.url
        });
        
      }
    );
  });
};

export default fetchArticle;
