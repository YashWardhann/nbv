// The following file is injected into the active tab opened 
// and has access to its DOM

console.log('%c Content Script Mounted', 'color: red; font-size: <16></16>px; ;font-weight: bold;');

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

function Article (text) {
    
    this.text = text;

    this.setText = function(newText) {
        this.text = newText;
        console.log('Text updated!');
    }

    this.getText = function() {
        return this.text;
    }

    this.getUrl = function() {
        return this.url;
    }
}

// Create a new Tab instance
let tab = new Tab(null, 0);


function getSelectedText() {
    let text; 
    if(window.getSelection) {
        text = window.getSelection().toString();
        console.log(window.getSelection());
    }

    return text;
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
            pinnedNote.innerHTML = '<h1>' + article.getText() + '</h1>';

            // Mount styles for the generated note
            

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
  	
  	let article = new Article(getSelectedText());
  	
  	try {
		// Send request to get the current url
		chrome.runtime.onMessage.addListener(
		    function(message, sender, sendResponse) {
		        createPin(article);
		        tab.updateParams({
		            url: message.url,
		            id: message.id
		        });
		    }
		);
	} catch (err) {
		console.error('Error');
	} 
});  
