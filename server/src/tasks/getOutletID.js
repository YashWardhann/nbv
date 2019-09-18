import request from 'request';
import { JaroWinklerDistance } from 'natural';

const getOutletID = async function(outletName) {
    return new Promise(async(resolve, reject) => {
        // Make the request to News API
        request(`https://newsapi.org/v2/sources?apiKey=${process.env.NEWS_API_KEY}`, 
        function(err, response, body) {
            if (err) {
                reject(err);
            }

            if(response.statusCode === 200) {
                body = JSON.parse(body);
                let sources = body.sources;

                sources = sources.filter(function(source) {
                    if(source.name === outletName) {
                        return source;
                    }
                });

                if(sources.length && 'id' in sources[0]) {
                    resolve(sources[0].id);
                } else {
                    reject('No sources matched.')
                }
            } else {
                reject(`HTTP Request failure: Code ${response.statusCode}`);
            }
        }) 
    })
}

export default getOutletID;