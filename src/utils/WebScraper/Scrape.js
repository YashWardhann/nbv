const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const MediaListing = require('./MediaListing');


// Connect to mongodb 
mongoose.connect('mongodb://admin:admin12@ds243897.mlab.com:43897/news-bias', {
    useNewUrlParser: true
})
.then(() => {
    console.log('Connected to mongodb');
    Scrape()
        .then(() => console.log('Scrapped website'))
        .catch((err) => console.error(err));
}) 
.catch((err) => {
    console.error(err);
});


async function Scrape() {
    try {
        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();

        const biases = ['Left', 'leftcenter', 'center', 'right-center', 'right', 'fake-news'];

        for (let i = 0; i < biases.length; i++) {
            await MediaListing(page, biases[i]);
        }

        await browser.close();

    } catch (err) {
        console.error(err);
    } 
}
