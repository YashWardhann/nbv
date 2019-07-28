import express from 'express';
import ejs from 'ejs';

import logger from './config/winston';
import apiRoutes from './routes/api/api.routes.js';

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Primary routes 
app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} request`);
    next();
});


// Mount the v1 api routes
app.use('/v1', apiRoutes);


// Allows to set alternative port during launch
const altPort = (process.argv[2]) ? process.argv[2] : 8080;

const server = app.listen(process.env.PORT || altPort, () => {
    logger.info(`Listening to port ${server.address().port}`);
});

module.exports = app; // For testing purposes