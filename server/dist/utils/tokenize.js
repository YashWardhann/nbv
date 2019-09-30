'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nlp = require('compromise');

// Returns an array whose each element is distinct
function distinctArray(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        for (var j = 0; j < i; j++) {
            if (array[j].includes(array[i])) {
                array.splice(i, 1);
            }
        }
    }
    return array;
}

var tokenize = function tokenize(sentence) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { returnType: 'string' };

    // Returns an object of keywords containing
    // nouns, places, people, topics, titlecased words
    // which can be used to replicate search results

    var tokens = [];
    var doc = nlp(sentence);

    // Convert the sentence to present tense, 
    // singular and affirmative
    doc.sentences().toPresentTense().toPositive().nouns().toSingular().normalize();

    // Grab all nouns
    var nouns = doc.nouns().out('array');

    // Grab all default named entities
    var topics = doc.topics().out('array');
    // Grab all titlecased words 
    var titlecased = doc.clauses().match('#TitleCase+').out('array');

    // Add all the arrays to the token array 
    tokens = [].concat((0, _toConsumableArray3.default)(tokens), [nouns, topics, titlecased]);

    // Flatten the array 
    tokens = Array.prototype.concat.apply([], tokens);

    // Return the tokens in different formats based on 
    // what the return type mentioned is in function call
    if (options.returnType === 'array') {
        return tokens;
    } else if (options.returnType === 'string') {
        return tokens.join(' ');
    } else if (options.returnType === 'url') {
        return tokens.join('+');
    }
};

console.log(tokenize('YASH wardhann kumar', { returnType: 'array' }));
//# sourceMappingURL=tokenize.js.map