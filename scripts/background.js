console.log('%c Background Script Mounted!', 'color: red; font-size: 16px; font-weight: bold;');

let remoteUrl = 'http://3ef31996.ngrok.io/v1/article';

function serialize(params) {
    let serializedString = Object.keys(params)
        .map(param => `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
        .join('&');

    console.log(serializedString);

    return serializedString;
}

function cleanTitle(str) {
    let indices = [];

    for (let i = 0; i < str.length; i++) {
        if(str[i] === '-') {
            indices.push(i);
        }
    }

    return str.slice(0, indices[indices.length - 1]);
}

// Make request to remote REST API to fetch results dynamically
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(`Recieved message from ${ sender }`);
        if (request.contentScriptQuery === 'fetchData' && request.sourceArticle) {
            fetch(remoteUrl, {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: serialize({
                    text: request.sourceArticle._text, 
                    url: request.sourceArticle._url
                })
            })
            .then((response) => {
                    if (response.status !== 200) {
                        sendResponse({
                            status: response.status,  
                            error: `Error fetching data. Error code: ${ response.status }`
                        });
                    } 
                    response.json()
                        .then((data) => {
                            console.log(data);
                            sendResponse({
                                status: response.status,
                                title: cleanTitle(data.title),
                                url: data.source[0].replace(/ *\([^)]*\) */g, ""), 
                                bias: data.bias
                            });
                            console.log('Sent response');
                        })
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
        return true; // Inform chrome that a delayed sendResponse will be sent
    }
);
