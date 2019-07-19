function Tab(url, id) {
    this.url = url;
    this.id = id;

    this.getUrl = function() {
        return this.url;
    }

    this.updateParams = function(newParams) {
        this.url = newParams.url;
        this.id = newParams.id;
    }
}

// Create a new Tab instance
let tab = new Tab(null, 0);


function getSelectedText() {
    let text; 
    if(window.getSelection) {
        text = window.getSelection().toString();
    }

    return text;
}


// Send request to get the current url
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        tab.updateParams({
            url: message.url,
            id: message.id
        });
    }
);

window.onload = function() {   
    console.log('Content Script Mounted!'); 
    window.addEventListener("mouseup", function() {
        console.log(getSelectedText());
        console.log(tab.getUrl());
    });  
}