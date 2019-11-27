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
        if (item.duration > 75000) {
            logger.warn(`[${item.name}]: ${item.duration}ms (Violation by ${Math.round((item.duration - 75000) * 100) / 100}ms)`);
        } else {
            logger.info(`[${item.name}]: ${item.duration}ms`);
        }
    })
});

performanceObserver.observe({entryTypes: ['measure']});

router.get('/', (req, res) => {
    res.send('Hey!');
});

router.get('/0', async (req,res) => {
    
    // Begin performance test 
    performance.mark('Beginning sanity check');

    const bias = await getOutletBias({
        url: 'bbc'
    });
        
    fetchArticle({
        title: "The phases of Trumps coming impeachment proceedings"
    }, 'left')
        .then((newArticle) => {
            res.status(200).json(newArticle);
            logger.info(`Sent article data to ${ req.url } (METHOD: ${ req.method })`);
           
            // End performance test 
            performance.mark('Ending sanity test');

            // Log performance details 
            performance.measure('API Sanity test', 'Beginning sanity test', 'Ending sanity test');

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

   const bias = await getOutletBias({
       url: 'bbc'
   });
   fetchArticle({
       title: "House takes major step towards impeachment"
   }, 'left')
       .then((newArticle) => {
           res.status(200).json(newArticle);
           logger.info(`Sent article data to ${ req.url } (METHOD: ${ req.method })`);
           // End performance test 
           performance.mark('Ending sanity test');
           // Log performance details 
           performance.measure('API Sanity test', 'Beginning sanity test', 'Ending sanity test');

       })
       .catch((err) => {
           res.status(404).json({
               'status': 404,
               'error': err                
           })
           logger.error(`${err} (404)`);
       });
});

export default router;