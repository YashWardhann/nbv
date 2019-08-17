const nlp = require('compromise');

const tokenize = function(sentence) {
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

    console.log(nouns);

    // Grab all default named entities
    let topics = doc.topics();

    // Grab all titlecased words 
    let titlecased = doc.clauses().match('#TitleCase+');

    // Add the titlecased words to the result
    topics = topics.concat(titlecased).unique().sort('chron');

    return topics.out('topk');
}

console.log(tokenize('Donald Trump bullied a man as overweight, then didnt apologize'));