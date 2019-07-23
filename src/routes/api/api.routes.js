import express from 'express';

let router = express.Router();

router.get('/', (req, res) => {
    res.send('Hey!');
});

router.post('/article', (req,res) => {
    return res.status(200).json({ title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" });
});

export default router;