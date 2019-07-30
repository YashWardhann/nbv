import express from 'express';
import bodyParser from 'body-parser';
import FetchArticle from './../../utils/FetchArticle';
import winston from './../../config/winston';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

let router = express.Router();

router.get('/', (req, res) => {
    res.send('Hey!');
});

router.get('/article', (req,res) => {
    FetchArticle({
        url: "thehindu"
    });
});

router.post('/article', urlencodedParser ,(req,res) => {
    return res.status(200).json({ 
        title: req.body.text,
        url: req.body.url
    });
});

export default router;