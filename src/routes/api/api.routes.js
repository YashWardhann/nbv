import express from 'express';
import bodyParser from 'body-parser';
import FetchArticle from './../../utils/FetchArticle';

import logger from './../../config/winston';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

let router = express.Router();

router.get('/', (req, res) => {
    res.send('Hey!');
});

router.get('/article', (req,res) => {
    FetchArticle({
        url: "thehindu"
    })
    .then((doc) => {
        res.json(doc)
    })
    .catch((err) => logger.error(err));
});

router.post('/article', urlencodedParser ,(req,res) => {
    FetchArticle({
        url: req.body.url
    })
    .then((doc) => {
        res.status(200).json({ 
            title: req.body.text,
            url: doc.name, 
            bias: doc.bias
        })
    })
    .catch((err) => logger.error(err));

});

export default router;