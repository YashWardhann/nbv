console.log('%c Background Script Mounted!', 'color: red; font-size: 16px; font-weight: bold;');

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

    let i = 0;    
    while (i < url.length) {
        if (url[i] === '.') {
            index.push(i);
        }        
        i++;
    }
    
    if (index.length == 1) {
        return url.slice(url.indexOf('/') + 2, index[0]);
    } else if(index.length == 2) {
        return url.slice(index[0] + 1, index[1]);
    }  
}

// Connect to active tab and send a message
chrome.browserAction.onClicked.addListener(
    function() {
        getActiveTab()
            .then((tab) => {
                chrome.tabs.sendMessage(tab.id, {
                    url: getHostName(tab.url),
                });
            })
    }
);

