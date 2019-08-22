import express from 'express';
import bodyParser from 'body-parser';
import getOutletBias from './../../tasks/getOutletBias';
import fetchArticle from './../../tasks/fetchArticle';

import logger from './../../config/winston';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

let router = express.Router();

router.get('/', (req, res) => {
    res.send('Hey!');
});

router.get('/0', async (req,res) => {
    const bias = await getOutletBias({
        url: 'bbc'
    });
        
    fetchArticle({
        title: "Kabul wedding blast: Groom has 'lost hope' after deadly attack"
    }, 'left')
        .then((newArticle) => {
            res.status(200).json(newArticle);
            logger.info(`Sent article data to ${ req.url } (METHOD: ${ req.method })`);
        })
        .catch((err) => {
            res.status(404).json({
                'status': 404,
                'error': err                
            })
            logger.error(`${err} (404)`);
        });

});

router.post('/0', urlencodedParser , async (req,res) => {

    // Fetch the bias of the publisher of the 
    // source article from remote db 
    const bias = await getOutletBias({
        url: 'bbc'
    });
    
    // Fetch an article and sent back response 
    // to the remote requester 
    fetchArticle(bias)
        .then((newArticle) => {
            res.status(200).json(newArticle);
            logger.info(`Sent article data to ${ req.url } (METHOD: ${ req.method })`);
        })
        .catch((err) => {
            res.status(404).json({
                'error': err
            });
            logger.error(`ERROR (404): ${err}`);
        });
});

export default router;