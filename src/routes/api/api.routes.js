import express from 'express';
import bodyParser from 'body-parser';
import getOutletBias from './../../tasks/getOutletBias';
import fetchArticle from './../../tasks/fetchArticle';
import { performance, PerformanceObserver } from 'perf_hooks';
import logger from './../../config/winston';    

const urlencodedParser = bodyParser.urlencoded({ extended: false });

let router = express.Router();

const performanceObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((item) => {
        if (item.duration > 120) {
            logger.warn(`[${item.name}]: ${item.duration}ms (Violation by ${Math.round((item.duration - 120) * 100) / 100}ms)`);
        } else {
            logger.info(`[${item.name}]: ${item.duration}ms`);
        }
    })
});

performanceObserver.observe({entryTypes: ['measure']});

router.get('/', (req, res) => {
    performance.mark('a');
    res.send('Hey!');
    performance.mark('b');

    performance.measure('API', 'a', 'b');
});

router.get('/0', async (req,res) => {
    const bias = await getOutletBias({
        url: 'bbc'
    });
        
    fetchArticle({
        title: "Fires in Amazon rainforest rage at record rate"
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

    // Begin performance test 
    performance.mark('Beginning sanity check');

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

    performance.mark('Ending sanity check');

    performance.measure('API Request', 'Beginning sanity check', 'Ending sanity check');
});

export default router;