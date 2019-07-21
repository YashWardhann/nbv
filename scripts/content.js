// The following file is injected into the active tab opened 
// and has access to its DOM

console.log('%c Content Script Mounted', 'color: red; font-size: 16px; font-weight: bold;');

function getArticleParams() {
   
    if(window.getSelection) {
        return {
            text: window.getSelection().toString(), 
            url: getHostName(window.getSelection().focusNode.baseURI)
        };
    }
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
    
    if (url.includes('www') || index.length == 2) {
        return url.slice(index[0] + 1, index[1]);
    } else {
        return url.slice(url.indexOf('/') + 2, index[0]);
    }  
}

let article = {
    text: undefined,
    url: undefined
};



// Create pinned box for data
function createPin(article) {
   	
    try {
        // Clean out all existing pins
        deletePins();

        //  The pinned note must be created within an iframe context 
        //  to prevent it from inheriting styles 
        
        // Create a container to wrap the iframes
        let container = document.createElement('div');
        container.setAttribute('class', 'generatedContainer');
        (document.getElementsByTagName('body')[0]).appendChild(container);

        let iframe = document.createElement('iframe');
        iframe.setAttribute('class', 'generatedIframe');
        
        container.appendChild(iframe);
         
        let iframeContext = iframe.contentDocument || iframe.contentWindow.document;
        // Write onto the iframe
        iframeContext.open();
        iframeContext.write('<html><body></body></html>');
        iframeContext.close();

        iframeBody = iframeContext.body;

        let pinnedNote = document.createElement('div');
        pinnedNote.setAttribute('class', 'pinnedNote');

        // Set the data for the note
        pinnedNote.innerHTML = `<b>${ article.text }</b><h5>BY ${ article.url.toUpperCase() } </h5>`;

        // Style the note 
        pinnedNote.style.fontSize = '18px';
        pinnedNote.style.color = '#fff';
        pinnedNote.style.fontFamily = 'Segoe ui, sans-serif';

        // Mount the generate note to the iframe
        iframeBody.appendChild(pinnedNote);
        iframeBody.style.overflow = 'hidden';

        // Increase height of iframe depending on content
        iframe.height = iframeBody.scrollHeight + 50; 
        console.log('Created pinned note!');
    } catch (err) {
        console.error(err);
    }
}

function deletePins() {
     // Clean out all pre-existing iframe
     [...document.getElementsByClassName('generatedIframe')].map(el => el.remove());
}
window.addEventListener("mouseup", function() {      
    try {
        let { text, url } = getArticleParams();
        if (text.trim()) {
            console.log('Entered this statement!');
            article.text = text; 
            article.url = url;

            createPin(article);
        } else {
            deletePins();
        }
    } catch (err) {
		console.error('Error');
	} 
});  

// Make request to remote REST API to fetch results dynamically
