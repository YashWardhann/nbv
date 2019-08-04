// The following file is injected into the active tab opened 
// and has access to its DOM

console.log('%c Content Script Mounted', 'color: red; font-size: 16px; font-weight: bold;');

class Article {

    /**
    * @param { String } text - Title of the article
    * @param { String } url - Origin URL of the article
    */

    constructor(text, url, bias) {
        this._text = text;
        this._url = url;
        this._bias = bias; 
    }

    get text() {
        return this._text.trim();
    }

    get url() {
        return this._url;
    }

    get bias() {
        return this._bias;
    }

    setParams(params) {
        this._text = params.text;
        this._url = params.url;
        this._bias = params.bias;
    }

    static clean() {
        // Clean out all pre-existing iframe
        [...document.getElementsByClassName('generatedIframe')].map(el => el.remove());
    }
};


// Initialize an empty container for the iframe
window.onload = function() {
    console.log('Window loaded');
    let container = document.createElement('div');
    container.setAttribute('class', 'iframeContainer');
    (document.getElementsByTagName('body')[0]).appendChild(container);
}

function getArticleParams() {   
    if(window.getSelection) {
        return {
            text: window.getSelection().toString(), 
            url: getHostName(window.getSelection().focusNode.baseURI)
        };
    }
}

// Returns the hostname extracted from the given url
// For eg: www.google.com would return google
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

// Get a random gradient background for the pin
function getRandomGradient() {
    // All gradients are taken from https://webgradients.com
    let gradients = [
        'linear-gradient(120deg, #a1c4fd 0%, #a7d7ec 100%)',
        'linear-gradient(120deg, #807af2 0%, #a8a4fb 100%)',
        'linear-gradient(120deg, #2ecc71 0%, #27ae60 100%)',
        'linear-gradient(120deg, #e74c3c 0%, #ff4757 100%)',
        'linear-gradient(120deg, #2f3542 0%, #535863 100%)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

// Create pinned box for data
function createPin(article) {
    try {
        //  The pinned note must be created within an iframe context 
        //  to prevent it from inheriting styles 
        
        // Create a container to wrap the iframes
        if (document.getElementsByClassName('generatedIframe').length >= 2) {
            Article.clean();
        } else {
            let iframe = document.createElement('iframe');
            iframe.setAttribute('class', 'generatedIframe');
            iframe.style.background =  getRandomGradient();
            iframe.height =  '0px';
              
            (document.getElementsByClassName('iframeContainer')[0]).appendChild(iframe);
             
            let iframeContext = iframe.contentDocument || iframe.contentWindow.document;
            // Write onto the iframe
            iframeContext.open();
            iframeContext.write('<html><body></body></html>');
            iframeContext.close();
            iframeBody = iframeContext.body;
            let pinnedNote = document.createElement('div');
            pinnedNote.setAttribute('class', 'pinnedNote');
            
            let textContainer = document.createElement('div');
            textContainer.setAttribute('class', 'generatedContainer');
            
            // Mount the text container
            pinnedNote.appendChild(textContainer);

            // Set the data for the note
            textContainer.innerHTML = `<b>${ article.text }</b><h5>BY ${ article.url.toUpperCase() } (${article.bias.toUpperCase()}) </h5>`;

            // Style the note and container
            pinnedNote.style.fontSize = '18px';
            pinnedNote.style.color = '#fff';
            pinnedNote.style.fontFamily = 'Segoe ui, sans-serif';
            pinnedNote.style.position = 'absolute';
            pinnedNote.style.width = '100%';
            pinnedNote.style.height = '100%';
            
            textContainer.style.position = 'absolute';
            textContainer.style.width = '100%';
            textContainer.style.top = '50%';
            textContainer.style.paddingRight = '10px';
            textContainer.style.boxSizing = 'border-box';
            textContainer.style.transform = 'translateY(-50%)';

            // Mount the generate note to the iframe
            iframeBody.appendChild(pinnedNote);
            iframeBody.style.overflow = 'hidden';

            // Increase height of iframe depending on content
            iframe.height = textContainer.clientHeight + 50; 
            iframe.width = textContainer.clientWidth + 50; 
            console.log('Created pinned note!');
        }
    } catch (err) {
        console.error(err);
    }
}

// Fetches a new article from a remote REST API
function fetchData(sourceArticle) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            contentScriptQuery: 'fetchData', 
            sourceArticle: sourceArticle
        }, function(response) {
           if(response) {
               resolve(response);
           } else {
               reject('No response was retured.');
           }
        });        
    });
}

window.addEventListener("mouseup", function() {  
    console.log('Fired mouseup event');    
    try {
        // Initialize a new source article and 
        // set it's parameters
        let sourceArticle = new Article(undefined, null, undefined);
        sourceArticle.setParams(getArticleParams());

        // Clean out all existing pins
        Article.clean();

        // getText method returns a trimmed string
        if (sourceArticle.text) {       
            // Initialize the new article fetched dynamically
            let remoteArticle = new Article(null, null);
            // Fetch data from the RESTful API and generate a new note
            fetchData(sourceArticle)
                .then((data) => {
                    remoteArticle.setParams({
                        text: data.title, 
                        url: data.url, 
                        bias: data.bias
                    });

                    // Generate a pin for the newly generated
                    // remote article
                    createPin(remoteArticle);
                });            
        } 
    } catch (err) {
		console.error('Error');
	} 
});  



