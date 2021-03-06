const nlp = require('compromise');

// Returns an array whose each element is distinct
function distinctArray (array) {
    for (let i = array.length - 1; i >=0 ; i--) {
        for (let j = 0; j < i; j++) {
           if(array[j].includes(array[i])) {
                array.splice(i,1);
           } 
        }
    }    
    return array;
}

const tokenize = function(sentence, options={returnType:'string'} ) {   
    // Returns an object of keywords containing
    // nouns, places, people, topics, titlecased words
    // which can be used to replicate search results
    let tokens = [];
    let doc = nlp(sentence);

    // Convert the sentence to present tense, 
    // singular and affirmative
    doc.sentences().toPresentTense()
        .toPositive()
        .nouns().toSingular()
        .normalize();

    // Grab all nouns
    let nouns = doc.nouns().out('array');

    // Grab all default named entities
    let topics = doc.topics().out('array');
    // Grab all titlecased words 
    let titlecased = doc.clauses().match('#TitleCase+').out('array');
    
    // Add all the arrays to the token array 
    tokens = [...tokens, topics, titlecased];

    // Flatten the array 
    tokens = Array.prototype.concat.apply([], tokens);

    // Remove all duplicates from the array 
    tokens = distinctArray(tokens)

    // Return the tokens in different formats based on 
    // what the return type mentioned is in function call
    if (options.returnType === 'array') {
        return tokens;
    } else if (options.returnType === 'string') {
        return tokens.join(' ');
    } else if (options.returnType === 'url') {
        return encodeURIComponent(tokens.join('+'));
    }
}

export default tokenize;