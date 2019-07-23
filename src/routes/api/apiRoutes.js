import { Router } from 'express';

let router = new Router();

router.get('/', (req, res) => {
    res.send('Hey!');
});

router.get('/article', (req,res) => {
    return res.status(200).json({ title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" });
});

export default router;