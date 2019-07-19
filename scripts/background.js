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

// Connect to active tab and send a message
chrome.browserAction.onClicked.addListener(function() {
        getActiveTab()
            .then((tab) => {
                chrome.tabs.sendMessage(tab.id, {
                    url: tab.url,
                    id: tab.id
                });
            })
            
    }
);

