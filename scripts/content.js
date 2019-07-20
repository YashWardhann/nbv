// The following file is injected into the active tab opened 
// and has access to its DOM

console.log('%c Content Script Mounted', 'color: red; font-size: <16></16>px; ;font-weight: bold;');

function Tab(url, id) {
    this.url = url;
    this.id = id;

    this.updateParams = function(newParams) {
        this.url = newParams.url;
        this.id = newParams.id;
    }
}

function getSelectedText() {
    let text; 
    if(window.getSelection) {
        text = window.getSelection().toString();
        console.log(window.getSelection());
    }

    return text;
}

// Send request to get the current url
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        createPin(article);
        console.log(message);
        tab.updateParams({
            url: message.url,
            id: message.id
        });
    }
);

// Create an empty article and an instance of a Tab
let tab = new Tab(null, 0);

let article = {
    text: undefined
}

// Create pinned box for data
function createPin(article) {
   	console.time('pinBlock');
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
        pinnedNote.innerHTML = '<h1>' + article.text + '</h1>';

        pinnedNote.style.fontSize = '8px';
        pinnedNote.style.color = '#fff';
        pinnedNote.style.fontFamily = 'Segoe ui, sans-serif, Impact';

        // Mount the generate note to the iframe
        iframeBody.appendChild(pinnedNote);
        console.log('Created pinned note!');
    } catch (err) {
        console.error(err);
    } finally {
      	console.timeEnd('pinBlock');
    }
}

window.addEventListener("mouseup", function() {  
    
    try {
        if (getSelectedText()) {
            article.text = getSelectedText();
            
            if (tab.url) {
                createPin(article);
            }
        }
    } catch (err) {
		console.error('Error');
	} 
});  
