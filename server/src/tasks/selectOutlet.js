const spawn = require('child_process').spawn;
const path = require('path');

function runScript() {
    return spawn("python", [
        "-u", 
        path.join(__dirname, "externals/hello.py"), 
        '--text=Heythere!'
    ])
}

const subProcess = runScript();

subProcess.stdout.on('data', function(data) {
    let dataStore = data;
    console.log(dataStore.toString());
})

subProcess.stderr.on('err', function(err) {
    console.log(`Error: ${err}`)
});

subProcess.stderr.on('close', function() {
    console.log('Process closed!')
});
