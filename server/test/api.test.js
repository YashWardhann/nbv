// Test the working of the CORE API 

// Set env variable to test during testing
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../src/app.js');
const should = chai.should();

const compareTokens = require('../src/utils/compareTokens');

chai.use(chaiHttp);

describe('Post article to /api/0', () => {
    it('Get a new opposing article', (done) => {
        chai.request(server)
            .post('/api/0')        
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                title: 'House Democrats step up Trump impeachment inquiry', 
                url: 'bbc news'
            })
            .end(async function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('url'); 
                done();
            })
    });
});

