var fs = require('fs');
var S = require('string');
var path = require('path');
var ejs = require('ejs');


function render(output, directory, onloadFunctionName, lang)
{
    var template = fs.readFileSync('htmls/template.ejs', 'utf8');
    var fileContent = fs.readFileSync('htmls/' + lang + '.js', 'utf8');
    var options = eval(fileContent);
    options.compile = {};
    options.compile.files = [];
    getFiles("", options.compile.files);
    getFiles(directory, options.compile.files);
    options.compile.onload = onloadFunctionName;
    options.filename = __dirname + '/htmls/template.ejs'


    options.compile.files.forEach(
        function (f) {
            template += "<% include " + f + " %>" + "\n";
        });
    template += "</body></html>"

    var outRendered = ejs.render(template, options);
    fs.writeFileSync('public/' + lang + '_' + output + '.html', outRendered);
}


function getFiles(directory, fullFiles)
{
    var files = fs.readdirSync(path.join('htmls', directory));

    for (var index in files) {
        var filename = files[index];
        if (S(filename).endsWith(".html")) {
            var fullFilename = path.join(directory, filename);
            fullFiles.push(fullFilename);
        }
    }
}

function main()
{
    var languages = ['en', 'fr'];
    if (process.argv.length > 2)
    {
        languages = [];
        for (var i = 2 ; i< process.argv.length; ++i)
        {
            languages.push(process.argv[i]);
        }
    }

    languages.forEach(function (lg)
    {
        render('full',     'full',  'raypick.applicationStart();',         lg);
        render('discover', 'tutos', 'raypick.applicationStartDiscover();', lg);
    });

}

//////
// OLD
//////

// function called at the end of thefile
function processOld()
{
    console.log("creating out.html :");
    var outHtml = compile(
        'htmls',
        'public/out.html',
        'raypick.applicationStart();',
        ['tutos'] // ignore files
    );

    console.log("");
    console.log("creating outDiscover.html :");
    compile(
        'htmls',
        'public/outDiscover.html',
        'raypick.applicationStartDiscover();',
        ['full'] // ignore files
    );


}

function compile(directory, outFilename, onLoadFunctionName, ignoreFilenames) {
    var bigFile =
        "<!DOCTYPE html>"
        + "<html>";

    // start with head.html
    var data = fs.readFileSync("htmls/head/head.html");
    bigFile = bigFile + data.toString();


    bigFile += "<body onload='" + onLoadFunctionName + "'>"


    bigFile += includeFiles(directory, outFilename, ignoreFilenames);


    bigFile +=
        "</body>"
        + "</html>"

    // write bigFile
    fs.writeFileSync(outFilename, bigFile);
    return bigFile;
}

function includeFiles(directory, outFilename, ignoreFilenames)
{
    var bigFile = "";

    var files = fs.readdirSync(directory);

    for (var index in files) {
        var filename = files[index];

        var fullFilename = path.join(directory, filename);

        //console.log("ignoreFilenames.indexOf(" + filename + ")=" ignoreFilenames.indexOf(filename));

        if (filename == "head.html"
            || filename == outFilename
            || ignoreFilenames.indexOf(filename) != -1) {
            continue;
        }

        stats = fs.lstatSync(fullFilename);
        if (stats.isDirectory())
        {
            console.log("  recursive on " + fullFilename );
            bigFile = bigFile + includeFiles(fullFilename, outFilename, ignoreFilenames)
        }
        else {

            console.log("  including " + fullFilename );

            if (S(filename).endsWith(".html")) {
                var data = fs.readFileSync(fullFilename);
                bigFile = bigFile + data.toString();
            }
        }
    }

    return bigFile;
}

main();


