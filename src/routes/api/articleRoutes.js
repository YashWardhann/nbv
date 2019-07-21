import express from 'express';

let router = express.Router();

router.post('/article', (res, req) => {
    console.log(req.body.article);
});

export default router;