import express from 'express';
import ejs from 'ejs';
import logger from './config/winston';
import apiRoutes from './routes/api/api.routes.js';
import mongoose  from 'mongoose';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to mongoose db
mongoose.connect('mongodb://admin:admin12@ds243897.mlab.com:43897/news-bias', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => {
    logger.info('Connected to Mongoose DB');
})
.catch((err) => {
    logger.error(err);
});
// Primary routes 
app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} request to: ${req.url}`);
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