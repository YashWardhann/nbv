const MediaOutlet = require('./../../models/media-model');

module.exports = async (page, bias) => {

    // Clear out all media outlet listings with the requested bias 
    MediaOutlet.deleteMany({
        bias: bias
    }, function(err) {
        if (err) { 
            throw new Error(err) 
        };
    });
   

    await page.goto('https://mediabiasfactcheck.com/' + bias);

    console.log(`Started generating listing for ${ bias } outlets`);

    const BiasList = await page.evaluate(() => {
        const containerDiv = (document.getElementsByClassName('entry clearfix'))[0];
        const parentDiv = (containerDiv.querySelectorAll('p'))[1];
        const els = parentDiv.querySelectorAll('a');
        
        let elsText = [];

        for (let i = 0; i < els.length; i++) {
            elsText[i] = els[i].innerText.replace('\n', '');            
        }

        return elsText;
    }); 

    for (let media of BiasList) {
        let listing = new MediaOutlet({
            name: media, 
            bias: bias
        });

        listing.save();
    }

    console.log(`Generated listing for ${ bias } media outlet`);
}