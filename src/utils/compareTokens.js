import tokenize from './tokenize';
import { JaroWinklerDistance } from 'natural';

function keywordExists(array, token) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
        if (JaroWinklerDistance(array[i], token, undefined, true) >= 0.8) {
            count++;
        }
    }
    
    if (count) { 
        return 1; 
    } else {
        return 0;
    }
}

const compareTokens = function(sourceTitle, remoteTitle) {
    let counter = 0; 
    let source_keywords = tokenize(sourceTitle, { returnType: "array" });
    let remote_keywords = tokenize(remoteTitle, { returnType: "array" });
    let longerArray, smallerArray;

    if (source_keywords.length >= remote_keywords.length) {
        longerArray = source_keywords; 
        smallerArray = remote_keywords;
    } else {
        longerArray = remote_keywords;
        smallerArray = source_keywords;
    }
    
    for (let i = 0; i < longerArray.length; i++) {
        if (keywordExists(smallerArray, longerArray[i])) {
            counter++;
        }
    }

    for (let i = 0; i < smallerArray.length; i++) {
        if (keywordExists(longerArray, smallerArray[i])) {
            counter++;
        }
    }

    return counter/(longerArray.length + smallerArray.length);

}

export default compareTokens;



