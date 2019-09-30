'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tokenize = require('./tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

var _natural = require('natural');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function keywordExists(array, token) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if ((0, _natural.JaroWinklerDistance)(array[i], token, undefined, true) >= 0.8) {
            count++;
        }
    }

    if (count) {
        return 1;
    } else {
        return 0;
    }
}

var compareTokens = function compareTokens(sourceTitle, remoteTitle) {
    var counter = 0;
    var source_keywords = (0, _tokenize2.default)(sourceTitle, { returnType: "array" });
    var remote_keywords = (0, _tokenize2.default)(remoteTitle, { returnType: "array" });
    var longerArray = void 0,
        smallerArray = void 0;

    if (source_keywords.length >= remote_keywords.length) {
        longerArray = source_keywords;
        smallerArray = remote_keywords;
    } else {
        longerArray = remote_keywords;
        smallerArray = source_keywords;
    }

    for (var i = 0; i < longerArray.length; i++) {
        if (keywordExists(smallerArray, longerArray[i])) {
            counter++;
        }
    }

    for (var _i = 0; _i < smallerArray.length; _i++) {
        if (keywordExists(longerArray, smallerArray[_i])) {
            counter++;
        }
    }

    return counter / (longerArray.length + smallerArray.length);
};

exports.default = compareTokens;
//# sourceMappingURL=compareTokens.js.map