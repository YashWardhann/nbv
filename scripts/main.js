
function getSelectedText() {
    let text; 
    if(window.getSelection) {
        text = window.getSelection().toString();
    }

    return text;
}

window.onload = function() {
    
    // Connect the injected script to the message channel with popup
    const messagePort = chrome.runtime.connect({name: "contentChannel"});
    
    // Send request to get current url
    messagePort.postMessage({
        request: 'fetchUrl'
    });

    messagePort.onMessage.addListener(function(msg) {
        console.log(msg.url);
    });
    
    window.addEventListener("mouseup", function() {
        console.log(getSelectedText());
    });
    
}