function getContextLocation(callback) {
    chrome.tabs.query({
        currentWindow: true, 
        active: true
     }, function(tabs) {
        console.log(tabs);
        if (tabs.length) {
            let url = tabs[0].url;
            callback(url);
        } 
    });
}

const messagePort = chrome.runtime.connect({name: "contentChannel"});

messagePort.onMessage.addListener(function(msg) {
    if (msg.request == 'fetchUrl') {
        getContextLocation(function(url) {
            messagePort.postMessage({url: url});
        });
    }
});