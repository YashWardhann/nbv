"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Returns a shuffled array
var shuffle = function shuffle(array) {
    var copy = [],
        n = array.length,
        i = void 0;

    while (n) {
        i = Math.floor(Math.random() * n);
        copy.push(array.splice(i, 1)[0]);
        n--;
    }

    return copy;
};

exports.default = shuffle;
//# sourceMappingURL=shuffle.js.map