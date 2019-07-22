console.log('%c Background Script Mounted!', 'color: red; font-size: 16px; font-weight: bold;');

// Make request to remote REST API to fetch results dynamically
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(`Recieved message from ${ sender }`);
        if (request.contentScriptQuery === 'fetchData' && request.sourceArticle) {
            fetch('https://jsonplaceholder.typicode.com/posts/1') // Dummy url
                .then((response) => {
                    if (response.status !== 200) {
                        console.log(`Error fetching data. Error code: ${ response.status }`);
                    } 
                    response.json()
                        .then((data) => {
                            console.log(data);
                            sendResponse({
                                title: data.title
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
