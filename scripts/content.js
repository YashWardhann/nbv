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

function Article (url, text) {
    
    this.text = text;
    this.url = url;

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


// Send request to get the current url
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log(message);
        tab.updateParams({
            url: message.url,
            id: message.id
        });
    }
);


console.log('Content Script Mounted!'); 

window.addEventListener("mouseup", function() {
    let article = new Article(tab.getUrl(), getSelectedText());

    console.log(article.getText());
         
    // Create pinned box for data
    function createPin(article) {
        try {
            // Clean out all pre-existing notes
            [...document.getElementsByClassName('pinnedNote')].map(el => el.remove());

            // Create a new note
            let pinnedNote = document.createElement('div');
            pinnedNote.setAttribute('class', 'pinnedNote');

            // Set the data for the note
            pinnedNote.innerHTML = '<h1>' + article.getText() + '</h1>';

            // Mount the style for the note 
                

            // Mount the generate note to the DOM
            (document.getElementsByTagName('body')[0]).appendChild(pinnedNote);
        } catch (err) {
            console.error(err);
        } finally {
            console.log('Created pinned note!');
        }
    }
        
    createPin(article);
    
       
    });  
