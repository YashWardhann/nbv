const spawn = require('child_process').spawn;
const path = require('path');

function runScript() {
    return spawn('python', [
        '-u', 
        path.join(__dirname, 'externals/hello.py'), 
        '-s', 'yashwardhann'
    ]);
}

const subprocess = runScript();

subprocess.stdout.on('data', (data) => {
    console.log(data.toString());
});

subprocess.stderr.on('data', (data) => {
    console.log('Error: ', data);
});

subprocess.stderr.on('close', () => {
    console.log('closed');
});