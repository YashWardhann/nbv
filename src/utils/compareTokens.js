import tokenize from './tokenize';

const compareTokens = function(source, remote) {
    let source_keywords = tokenize(source, { returnType: 'array' });
    let remote_keywords = tokenize(remote, { returnType: 'array' });

}

export default compareTokens;