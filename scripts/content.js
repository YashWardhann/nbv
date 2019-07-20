// The following file is injected into the active tab opened 
// and has access to its DOM

console.log('%c Content Script Mounted', 'color: red; font-size: 16px; font-weight: bold;');

function getSelectedText() {
    let text; 
    if(window.getSelection) {
        text = window.getSelection().toString();
        console.log(window.getSelection());
    }
    return text;
}

let article = {
    text: undefined,
    url: undefined
};


// Send request to get the current url
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        article.url = message.url;
        
        if (article.text) {
            createPin(article);
        }
    }
);

// Create pinned box for data
function createPin(article) {
   	
    try {
        // Clean out all pre-existing iframe
        [...document.getElementsByClassName('generatedIframe')].map(el => el.remove());

        //  The pinned note must be created within an iframe context 
        //  to prevent it from inheriting styles 

        let iframe = document.createElement('iframe');
        iframe.setAttribute('class', 'generatedIframe');
        (document.getElementsByTagName('body')[0]).appendChild(iframe);
         
        let iframeContext = iframe.contentDocument || iframe.contentWindow.document;
        // Write onto the iframe
        iframeContext.open();
        iframeContext.write('<html><body></body></html>');
        iframeContext.close();

        iframeBody = iframeContext.body;
            
        let pinnedNote = document.createElement('div');
        pinnedNote.setAttribute('class', 'pinnedNote');

        // Set the data for the note
        pinnedNote.innerHTML = `<h1>${ article.text }</h1><br><h2>${ article.url.toUpperCase() }</h2>`;

        // Style the note 
        pinnedNote.style.fontSize = '8px';
        pinnedNote.style.color = '#fff';
        pinnedNote.style.fontFamily = 'Segoe ui, sans-serif, Impact';

        // Mount the generate note to the iframe
        iframeBody.appendChild(pinnedNote);
        console.log('Created pinned note!');
    } catch (err) {
        console.error(err);
    }
}

window.addEventListener("mouseup", function() {      
    try {
        if (getSelectedText()) {
            article.text = getSelectedText();
        }
    } catch (err) {
		console.error('Error');
	} 
});  
