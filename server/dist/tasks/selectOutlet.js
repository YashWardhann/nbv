'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

function runScript() {
    return spawn('python', ['-u', path.join(__dirname, 'externals/hello.py'), '-s', 'yashwardhann']);
}

var subprocess = runScript();

subprocess.stdout.on('data', function (data) {
    console.log(data.toString());
});

subprocess.stderr.on('data', function (data) {
    console.log('Error: ', data);
});

subprocess.stderr.on('close', function () {
    console.log('closed');
});
//# sourceMappingURL=selectOutlet.js.map