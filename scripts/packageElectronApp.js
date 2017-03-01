var packager = require('electron-packager');

var args = process.argv.slice(2);
var options = {};

for (var a = 0, argsCount = args.length; a < argsCount; a++) {
    var currentArg = args[a];
    var nextArg = args[a + 1];

    if (currentArg.indexOf('--') === 0 && (nextArg && nextArg.indexOf('--') === -1)) {
        currentArg = currentArg.slice(2);

        options[currentArg] = nextArg;

        a++;
    } else {
        currentArg = currentArg.slice(2).split('=');

        if (currentArg.length > 1) {
            options[currentArg.shift()] = currentArg.shift();
        } else {
            options[currentArg.shift()] = true;
        }
    }
}

options.dir = (options.dir || '.');
options.out = (options.out || 'builds');
options.overwrite = (options.overwrite || true);
options.ignore = (options.ignore || function (fileName) {
    return !(fileName === '' ||
        fileName.indexOf('/dist') === 0 ||
        fileName.indexOf('/package.json') === 0 ||
        fileName.indexOf('/electron-main.js') === 0
    );
});

packager(options, function done_callback (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Packaging Complete ✔');
});
