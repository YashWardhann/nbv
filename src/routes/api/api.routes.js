import express from 'express';
import bodyParser from 'body-parser';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

let router = express.Router();

router.get('/', (req, res) => {
    res.send('Hey!');
});

router.post('/article', urlencodedParser ,(req,res) => {
    let { title, url } = JSON.parse(req.body);
    return res.status(200).json({ title: title });
});

export default router;