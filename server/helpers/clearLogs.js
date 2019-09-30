process.env.NODE_ENV = 'maintainence'

// Clear the winston logs to avoid large file sizes 
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../src/logs');
const logs = ['combined.log', 'error.log'];

logs.forEach(function(log) {
    let logPath = path.join(logDir, log);
    fs.access(logPath, fs.constants.W_OK, (err) => {
        console.log(`${logPath} is ${err ? 'not writable' : 'opened'}`);
        try {
            // Clear out the log file
            fs.writeFile(logPath, '', (err) => {
                if (err) throw err;

                console.log(`${logPath} cleared!`)
            });
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    });
});




