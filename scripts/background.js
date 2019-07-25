console.log('%c Background Script Mounted!', 'color: red; font-size: 16px; font-weight: bold;');

let remoteUrl = 'https://obscure-headland-96128.herokuapp.com';

function serialize(params) {
    let serializedString = Object.keys(params)
        .map(param => `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
        .join('&');

    console.log(serializedString);

    return serializedString;
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
                        console.log(`Error fetching data. Error code: ${ response.status }`);
                    } 
                    response.json()
                        .then((data) => {
                            console.log(data);
                            sendResponse({
                                title: data.title,
                                url: data.url
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
