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
}

var gameAssets = {};

var loaderTypes = {
    image: {},
    atlas: {},
    audio: {},
    audiosprite: {},
    bitmap_font: {},
    json: {},
    xml: {},
    text: {},
    misc: {}
};

var audioExtensions = ['aac', 'flac', 'mp3', 'mp4', 'ogg', 'wav', 'webm'];
var imageExtensions = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'webp'];
var fontExtensions = ['eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];
var bitmapFontExtensions = ['xml', 'fnt'];
var jsonExtensions = ['json'];
var xmlExtensions = ['xml'];
var textExtensions = ['txt'];

shell.ls('assets/**/*.*').forEach(function (file) {
    var filePath = file.replace('assets/', '').split('.');

    gameAssets[filePath[0]] = gameAssets[filePath[0]] || [];
    gameAssets[filePath[0]].push(filePath[1]);
});

for (var i in gameAssets) {
    var imageType = findExtension(gameAssets[i], imageExtensions);
    var audioType = findExtension(gameAssets[i], audioExtensions);
    var fontType = findExtension(gameAssets[i], fontExtensions);
    var bitmapFontType = findExtension(gameAssets[i], bitmapFontExtensions);
    var jsonType = findExtension(gameAssets[i], jsonExtensions);
    var xmlType = findExtension(gameAssets[i], xmlExtensions);
    var textType = findExtension(gameAssets[i], textExtensions);

    if (bitmapFontType) {
        var isItActuallyAFont = false;

        for (var ext in gameAssets[i]) {
            if (((shell.grep(/^[\s\S]*?<font>/g, ('assets/' + i + '.' + gameAssets[i][ext]))).length > 1)) {
                isItActuallyAFont = true;
                break;
            }
        }

        bitmapFontType = isItActuallyAFont;
    }

    if (bitmapFontType && imageType) {
        loaderTypes.bitmap_font[i] = gameAssets[i];
    } else if (audioType) {
        if (jsonType) {
            loaderTypes.audiosprite[i] = gameAssets[i];
        } else {
            loaderTypes.audio[i] = gameAssets[i];
        }
    } else if (imageType) {
        if (jsonType || xmlType) {
            loaderTypes.atlas[i] = gameAssets[i];
        } else {
            loaderTypes.image[i] = gameAssets[i];
        }
    } else if (jsonType) {
        loaderTypes.json[i] = gameAssets[i];
    } else if (xmlType) {
        loaderTypes.xml[i] = gameAssets[i];
    } else if (textType) {
        loaderTypes.text[i] = gameAssets[i];
    } else {
        loaderTypes.misc[i] = gameAssets[i];
    }
}

var assetsClassFile = 'src/assets.ts';
shell.rm('-f', assetsClassFile);

shell.ShellString('/* AUTO GENERATED FILE. DO NOT MODIFY. YOU WILL LOSE YOUR CHANGES ON BUILD. */\n\n').to(assetsClassFile);

shell.ShellString('export namespace Images {\n    class IExistSoTheBuildDoesntFailWithAnEmptyNamespace {}').toEnd(assetsClassFile);
for (var i in loaderTypes.image) {
    shell.ShellString('\n\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.image[i]) {
        shell.ShellString('\n        static get' + loaderTypes.image[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.image[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Atlases {\n    class IExistSoTheBuildDoesntFailWithAnEmptyNamespace {}').toEnd(assetsClassFile);
for (var i in loaderTypes.atlas) {
    shell.ShellString('\n\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.atlas[i]) {
        var type = '';

        if (jsonExtensions.indexOf(loaderTypes.atlas[i][t]) !== -1) {
            if (shell.grep(/"frames":\s*(\[)/g, ('assets/' + i + '.' + loaderTypes.atlas[i][t])).length > 1) {
                type = 'Array';
            } else if (shell.grep(/"frames":\s*(\{)/g, ('assets/' + i + '.' + loaderTypes.atlas[i][t])).length > 1) {
                type = 'Hash';
            }
        } else if (xmlExtensions.indexOf(loaderTypes.atlas[i][t]) !== -1) {
            type = 'XML';
        }
        shell.ShellString('\n        static get' + loaderTypes.atlas[i][t].toUpperCase() + type + '(): string { return \'assets/' + i + '.' + loaderTypes.atlas[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Audio {\n    class IExistSoTheBuildDoesntFailWithAnEmptyNamespace {}').toEnd(assetsClassFile);
for (var i in loaderTypes.audio) {
    shell.ShellString('\n\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.audio[i]) {
        shell.ShellString('\n        static get' + loaderTypes.audio[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.audio[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Audiosprites {\n    class IExistSoTheBuildDoesntFailWithAnEmptyNamespace {}').toEnd(assetsClassFile);
for (var i in loaderTypes.audiosprite) {
    shell.ShellString('\n\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.audiosprite[i]) {
        shell.ShellString('\n        static get' + loaderTypes.audiosprite[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.audiosprite[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace BitmapFonts {\n    class IExistSoTheBuildDoesntFailWithAnEmptyNamespace {}').toEnd(assetsClassFile);
for (var i in loaderTypes.bitmap_font) {
    shell.ShellString('\n\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.bitmap_font[i]) {
        shell.ShellString('\n        static get' + loaderTypes.bitmap_font[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.bitmap_font[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace JSON {\n    class IExistSoTheBuildDoesntFailWithAnEmptyNamespace {}').toEnd(assetsClassFile);
for (var i in loaderTypes.json) {
    shell.ShellString('\n\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.json[i]) {
        shell.ShellString('\n        static get' + loaderTypes.json[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.json[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace XML {\n    class IExistSoTheBuildDoesntFailWithAnEmptyNamespace {}').toEnd(assetsClassFile);
for (var i in loaderTypes.xml) {
    shell.ShellString('\n\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.xml[i]) {
        shell.ShellString('\n        static get' + loaderTypes.xml[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.xml[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Text {\n    class IExistSoTheBuildDoesntFailWithAnEmptyNamespace {}').toEnd(assetsClassFile);
for (var i in loaderTypes.text) {
    shell.ShellString('\n\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.text[i]) {
        shell.ShellString('\n        static get' + loaderTypes.text[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.text[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Misc {\n    class IExistSoTheBuildDoesntFailWithAnEmptyNamespace {}').toEnd(assetsClassFile);
for (var i in loaderTypes.misc) {
    shell.ShellString('\n\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

    for (var t in loaderTypes.misc[i]) {
        shell.ShellString('\n        static get' + loaderTypes.misc[i][t].toUpperCase() + '(): string { return \'assets/' + i + '.' + loaderTypes.misc[i][t] + '\'; };').toEnd(assetsClassFile);
    }

    shell.ShellString('\n    }').toEnd(assetsClassFile);
}
shell.ShellString('\n}\n').toEnd(assetsClassFile);
