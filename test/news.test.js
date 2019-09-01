process.env.NODE_ENV = 'test';

const chai = require('chai');
const request = require('request');
const should = chai.should();

const baseUrl = 'https://newsapi.org/v2/everything?q=trump+el+paso&domains=foxnews.com&'+process.env.NEWS_API_KEY;

// A dummy source article for testing
const source = {
    title: undefined, 
    bias: undefined
}

describe('News API test', () => {
    it('Fetch an article from the news api', (done) => {
        request(baseUrl, function(err, response, body) {
            should.not.exist(err);
            response.statusCode.should.be(200);
            response.body.should.be.a('object');
        });
    });
});