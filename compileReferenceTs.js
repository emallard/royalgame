var fs = require('fs');
var S = require('string');

var traverseFileSystem = function (currentPath, callback) {

    var files = fs.readdirSync(currentPath);
    for (var i in files) {
        var currentFile = currentPath + '/' + files[i];
        var stats = fs.statSync(currentFile);
        if (stats.isFile()) {

            callback(currentFile);

        }
        else if (stats.isDirectory()) {
            traverseFileSystem(currentFile, callback);
        }
    }
};


var fileContent = "";
var callback = function(currentFile)
{
    if(currentFile == "./reference.ts")
    {
        return;
    }

    if (S(currentFile).endsWith(".ts"))
    {
        fileContent += "///<reference path='" + currentFile +  "' />\n";
    }
}

traverseFileSystem('.', callback);

fs.writeFileSync('reference.ts', fileContent);

/*
var spawn = require('child_process').spawn;
var tsc = spawn('/usr/local/bin/tsc',['reference.ts','--out','out/out.js','--sourcemap']);
tsc.stderr.on('data', function(data) { process.stderr.write(data); });
*/
/*
var exec = require('child_process').exec;

var tsc = '/usr/local/bin/tsc reference.ts --out out/out.js --sourcemap';
// excute wget using child_process' exec function

var child = exec(tsc, function(err, stdout, stderr) {
    process.stderr.write(stderr);
    //if (err) throw stderr.write(err);
    //else console.log('end');
});
*/