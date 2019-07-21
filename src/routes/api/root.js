import express from 'express';
import articleRoutes from './articleRoutes';

let router = express.Router();

router.all('*', (req, res, next) => {
    console.log(`Incoming ${req.method} request`);
    next();
});

router.get('/', (req, res) => {
    res.send('Hey!');
});

router.use('/article', articleRoutes);

export default router;