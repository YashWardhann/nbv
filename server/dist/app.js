'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _winston = require('./config/winston');

var _winston2 = _interopRequireDefault(_winston);

var _apiRoutes = require('./routes/api/api.routes.js');

var _apiRoutes2 = _interopRequireDefault(_apiRoutes);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', _path2.default.join(__dirname, 'views'));

// Connect to mongoose db
_mongoose2.default.connect('mongodb://admin:admin12@ds243897.mlab.com:43897/news-bias', {
    useNewUrlParser: true
}).then(function () {
    _winston2.default.info('Connected to Mongoose DB');
}).catch(function (err) {
    _winston2.default.error(err);
});

// Primary routes 
app.use(function (req, res, next) {
    _winston2.default.info('Incoming ' + req.method + ' request to: ' + req.url);
    next();
});

// Mount the v1 api routes
app.use('/api/', _apiRoutes2.default);

// Allows to set alternative port during launch
var altPort = process.argv[2] ? process.argv[2] : 8080;

var server = app.listen(process.env.PORT || altPort, function () {
    _winston2.default.info('Listening to port ' + server.address().port);
});

module.exports = app; // For testing purposes
//# sourceMappingURL=app.js.map