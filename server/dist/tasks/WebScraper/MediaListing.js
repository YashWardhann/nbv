'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MediaOutlet = require('./../../models/media-model');

module.exports = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(page, bias) {
        var BiasList, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, media, listing;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // Clear out all media outlet listings with the requested bias 
                        MediaOutlet.deleteMany({
                            bias: bias
                        }, function (err) {
                            if (err) {
                                throw new Error(err);
                            };
                        });

                        _context.next = 3;
                        return page.goto('https://mediabiasfactcheck.com/' + bias);

                    case 3:

                        console.log('Started generating listing for ' + bias + ' outlets');

                        _context.next = 6;
                        return page.evaluate(function () {
                            var containerDiv = document.getElementsByClassName('entry clearfix')[0];
                            var parentDiv = containerDiv.querySelectorAll('table')[0];
                            var els = parentDiv.querySelectorAll('tr');

                            var elsText = [];

                            for (var i = 0; i < els.length; i++) {
                                if (els[i].querySelector('a')) {
                                    elsText[i] = els[i].querySelector('a').innerText.replace('\n', '').replace('/ \([\s\S]*?\)/g', '');
                                }
                            }

                            return elsText;
                        });

                    case 6:
                        BiasList = _context.sent;
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 10;


                        for (_iterator = (0, _getIterator3.default)(BiasList); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            media = _step.value;
                            listing = new MediaOutlet({
                                name: media,
                                bias: bias
                            });


                            listing.save();
                        }

                        _context.next = 18;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](10);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 18:
                        _context.prev = 18;
                        _context.prev = 19;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 21:
                        _context.prev = 21;

                        if (!_didIteratorError) {
                            _context.next = 24;
                            break;
                        }

                        throw _iteratorError;

                    case 24:
                        return _context.finish(21);

                    case 25:
                        return _context.finish(18);

                    case 26:
                        console.log('Generated listing for ' + bias + ' media outlet');

                    case 27:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[10, 14, 18, 26], [19,, 21, 25]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();
//# sourceMappingURL=MediaListing.js.map