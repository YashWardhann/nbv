import express from 'express';
import bodyParser from 'body-parser';
import getOutletBias from './../../utils/getOutletBias';
import fetchArticle from './../../utils/fetchArticle';

import logger from './../../config/winston';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

let router = express.Router();

router.get('/', (req, res) => {
    res.send('Hey!');
});

router.get('/article', async (req,res) => {
    const bias = await getOutletBias({
        url: 'thehindu'
    });
    
    const ok = await fetchArticle('left');
    console.log(ok);

});

router.post('/article', urlencodedParser , async (req,res) => {
    const bias = await getOutletBias({
        url: req.body.url
    });
    
    res.status(200).json({
        bias: bias
    });
});

export default router;