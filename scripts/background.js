console.log('Background Script Mounted!');

// Gets the current active tab
function getActiveTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({
            currentWindow: true, 
            active: true
         }, function(tabs) {
            console.log(tabs);
            if (tabs.length) {
                let tab = tabs[0];
                resolve(tab);
            } else {
                reject('No Active Tabs!');
            }
        });
    });
}

function getHostName(url) {
    let index = [];

    for (let i = 0; i < url.length; i++) {
        if (url[i] === '.') {
            index.push(i);
        }
    }

    return url.slice(index[0] + 1, index[1]);
}

// Connect to active tab and send a message
chrome.browserAction.onClicked.addListener(function() {
        getActiveTab()
            .then((tab) => {
                console.log(tab);
                chrome.tabs.sendMessage(tab.id, {
                    url: getHostName(tab.url),
                    id: tab.id
                });
            })
            
    }
);

