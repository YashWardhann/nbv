import express from 'express';
import bodyParser from 'body-parser';
import winston from './../../config/winston';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

let router = express.Router();

router.get('/', (req, res) => {
    res.send('Hey!');
});

router.post('/article', urlencodedParser ,(req,res) => {
    console.log(req.body);
    return res.status(200).json({ title: "Hey there!" });
});

export default router;