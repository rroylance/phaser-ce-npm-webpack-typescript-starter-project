var shell = require('shelljs');

function toCamelCase(string) {
    return string.replace(/[^A-Za-z0-9]/g, ' ').replace(/^\w|[A-Z]|\b\w|\s+/g, function (match, index) {
        if (+match === 0 || match === '-' || match === '.' ) {
            return "";
        }
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

function toPascalCase(string) {
    var camelCase = toCamelCase(string);

    return camelCase[0].toUpperCase() + camelCase.substr(1);
}

function findExtension(haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};

var gameAssets = {};

var loaderTypes = {
    image: {},
    atlas: {},
    audio: {},
    audiosprite: {},
    data: {}
}

var audioExtensions = ['aac', 'flac', 'mp3', 'mp4', 'ogg', 'wav', 'webm'];
var imageExtensions = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'webp', 'svg'];
var dataExtensions = ['json'];

shell.ls('assets/**/*.*').forEach(function (file) {
    var filePath = file.replace('assets/', '').split('.');

    gameAssets[filePath[0]] = gameAssets[filePath[0]] || [];
    gameAssets[filePath[0]].push(filePath[1]);
});

for (var i in gameAssets) {
    var audioType = findExtension(gameAssets[i], audioExtensions);
    var imageType = findExtension(gameAssets[i], imageExtensions);
    var dataType = findExtension(gameAssets[i], dataExtensions);

    if (audioType) {
        if (dataType) {
            loaderTypes.audiosprite[i] = gameAssets[i];
        } else {
            loaderTypes.audio[i] = gameAssets[i];
        }
    } else if (imageType) {
        if (dataType) {
            loaderTypes.atlas[i] = gameAssets[i];
        } else {
            loaderTypes.image[i] = gameAssets[i];
        }
    } else if (dataType) {
        loaderTypes.data[i] = gameAssets[i];
    }
}

//shell.ShellString(JSON.stringify(loaderTypes)).to('assets.json');

var assetsClassFile = 'src/assets.ts';
shell.rm('-f', assetsClassFile);

shell.ShellString('export namespace Images {').toEnd(assetsClassFile);
for (var i in loaderTypes.image) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.image[i]) {
        shell.ShellString('\n        static get' + loaderTypes.image[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.image[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Atlases {').toEnd(assetsClassFile);
for (var i in loaderTypes.atlas) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.atlas[i]) {
        shell.ShellString('\n        static get' + loaderTypes.atlas[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.atlas[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Audio {').toEnd(assetsClassFile);
for (var i in loaderTypes.audio) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.audio[i]) {
        shell.ShellString('\n        static get' + loaderTypes.audio[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.audio[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Audiosprites {').toEnd(assetsClassFile);
for (var i in loaderTypes.audiosprite) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.audiosprite[i]) {
        shell.ShellString('\n        static get' + loaderTypes.audiosprite[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.audiosprite[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Data {').toEnd(assetsClassFile);
for (var i in loaderTypes.data) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.data[i]) {
        shell.ShellString('\n        static get' + loaderTypes.data[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.data[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);
