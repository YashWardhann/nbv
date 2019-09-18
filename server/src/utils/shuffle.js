// Returns a shuffled array
const shuffle = function(array) {
    let copy = [], n = array.length, i;
    
    while(n) {
        i = Math.floor(Math.random() * n);
        copy.push(array.splice(i, 1)[0]);
        n--;
    }

    return copy;
}

export default shuffle;
