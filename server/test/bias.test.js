// Fetch the bias of known media outlets 

// Set NODE ENV to test to disable debug console
process.env.NODE_ENV = 'test';

const chai = require('chai');
const mongoose = require('mongoose');
const should = chai.should();
const getOutletBias = require('../src/tasks/getOutletBias');
const MediaListing = require('../src/models/media-model');
const biases = require('../src/data/biases');

const requestOutlet = function(params) {
    return new Promise((resolve, reject) => {
        MediaListing.find({}, 
            function(err, docs) {
                if(err) { reject(err); }

                const doc = docs[Math.floor(Math.random() * docs.length)];
                resolve(doc);
            });
    });
}
function search(array, key) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name === key) {
            return array[i];
        }
    }
}

// Make connection with MongoDB to fetch bias
describe('Get the bias of media outlet', () => {
    // Before perfoming the test a sandbox connection to the 
    // remote database is created 
    before((done) => {
        mongoose.connect('mongodb://admin:admin12@ds243897.mlab.com:43897/news-bias', {
            useNewUrlParser: true
        })
        .then(() => {
            done();
        });

    });

    it('Fetch bias from remote database', async (done) => {
        const DB_Outlet = await requestOutlet({ type: 'random' })
        const CSV_Outlet = search(biases, DB_Outlet.name);

        DB_Outlet.should.be.a('object');
        CSV_Outlet.should.be.a('object');
        
        DB_Outlet.should.have.property('name');
        DB_Outlet.bias.should.be.equal(CSV_Outlet.bias);

        done();
    });
});
