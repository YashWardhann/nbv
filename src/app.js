import express from 'express';
import ejs from 'ejs';
import logger from './config/winston';
import apiRoutes from './routes/api/api.routes.js';
import mongoose  from 'mongoose';

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Connect to mongoose db
mongoose.connect('mongodb://admin:admin12@ds243897.mlab.com:43897/news-bias', {
    useNewUrlParser: true
})
.then(() => {
    logger.info('Connected to Mongoose DB');
})
.catch((err) => {
    logger.error(err);
});

// Primary routes 
app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} request`);
    next();
});


// Mount the v1 api routes
app.use('/api/', apiRoutes);


// Allows to set alternative port during launch
const altPort = (process.argv[2]) ? process.argv[2] : 8080;

const server = app.listen(process.env.PORT || altPort, () => {
    logger.info(`Listening to port ${server.address().port}`);
});

module.exports = app; // For testing purposes