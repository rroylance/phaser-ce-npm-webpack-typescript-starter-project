var shell = require('shelljs');
var fs = require('fs');
var xml2js = require('xml2js');
var commander = require('commander');
var webpack = require('webpack');
var webpackConfig;

commander
    .option('--dev', 'Use webpack.dev.config.js for some values, excluding this will use webpack.dist.config.js (currently only GOOGLE_WEB_FONTS is being used).')
    .parse(process.argv);

if (commander.dev) {
    webpackConfig = require('../webpack.dev.config.js');
} else {
    webpackConfig = require('../webpack.dist.config.js');
}

function toCamelCase(string) {
    return string.replace(/[^A-Za-z0-9]/g, ' ').replace(/^\w|[A-Z]|\b\w|\s+/g, function (match, index) {
        if (+match === 0 || match === '-' || match === '.') {
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
    font: {},
    bitmap_font: {},
    json: {},
    xml: {},
    text: {},
    misc: {}
};

var audioExtensions = ['aac', 'ac3', 'caf', 'flac', 'm4a', 'mp3', 'mp4', 'ogg', 'wav', 'webm'];
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
    } else if (fontType) {
        loaderTypes.font[i] = gameAssets[i];
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

shell.ShellString('export namespace Images {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.image).length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in loaderTypes.image) {
        shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
        shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

        for (var t in loaderTypes.image[i]) {
            shell.ShellString('\n        static get' + loaderTypes.image[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.image[i][t] + '\'); };').toEnd(assetsClassFile);
        }

        shell.ShellString('\n    }').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Atlases {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.atlas).length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in loaderTypes.atlas) {
        var dataExtensions = [];
        var dataTypes = [];

        for (var t in loaderTypes.atlas[i]) {
            var dataFile = ('assets/' + i + '.' + loaderTypes.atlas[i][t]);
            var fileData = null;
            var json = null;
            var parser = null;
            var frameFull = '';
            var frame = '';

            dataExtensions.push(loaderTypes.atlas[i][t]);

            if (jsonExtensions.indexOf(loaderTypes.atlas[i][t]) !== -1) {
                shell.ShellString('\n    enum ' + toPascalCase(i) + 'Frames {').toEnd(assetsClassFile);

                try {
                    fileData = fs.readFileSync(dataFile, 'ascii');
                    json = JSON.parse(fileData);

                    if (Array.isArray(json['frames'])) {
                        dataTypes.push('Array');

                        for (var a in json['frames']) {
                            frameFull = (json['frames'][a]['filename']);
                            frame = frameFull.substring(0, frameFull.lastIndexOf('.'));
                            shell.ShellString('\n        ' + toPascalCase(frame) + ' = <any>\'' + frameFull + '\',').toEnd(assetsClassFile);
                        }
                    } else {
                        dataTypes.push('Hash');

                        for (var h in json['frames']) {
                            frameFull = (h);
                            frame = frameFull.substring(0, frameFull.lastIndexOf('.'));
                            shell.ShellString('\n        ' + toPascalCase(frame) + ' = <any>\'' + frameFull + '\',').toEnd(assetsClassFile);
                        }
                    }
                } catch (e) {
                    console.log('Atlas Data File Error: ', e);
                }

                shell.ShellString('\n    }').toEnd(assetsClassFile);
            } else if (xmlExtensions.indexOf(loaderTypes.atlas[i][t]) !== -1) {
                dataTypes.push('');

                shell.ShellString('\n    enum ' + toPascalCase(i) + 'Frames {').toEnd(assetsClassFile);

                try {
                    fileData = fs.readFileSync(dataFile, 'ascii');
                    parser = new xml2js.Parser();

                    parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
                        for (var x in result['TextureAtlas']['SubTexture']) {
                            frameFull = (result['TextureAtlas']['SubTexture'][x]['$']['name']);
                            frame = frameFull.substring(0, frameFull.lastIndexOf('.'));
                            shell.ShellString('\n        ' + toPascalCase(frame) + ' = <any>\'' + frameFull + '\',').toEnd(assetsClassFile);
                        }
                    });
                } catch (e) {
                    console.log('Atlas Data File Error: ', e);
                }

                shell.ShellString('\n    }').toEnd(assetsClassFile);
            } else {
                dataTypes.push('');
            }
        }

        shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
        shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };').toEnd(assetsClassFile);
        for (var e in dataExtensions) {
            shell.ShellString('\n\n        static get' + dataExtensions[e].toUpperCase() + dataTypes[e] + '(): string { return require(\'assets/' + i + '.' + dataExtensions[e] + '\'); };').toEnd(assetsClassFile);
        }
        shell.ShellString('\n\n        static Frames = ' + toPascalCase(i) + 'Frames;').toEnd(assetsClassFile);
        shell.ShellString('\n    }').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Audio {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.audio).length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in loaderTypes.audio) {
        shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
        shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

        for (var t in loaderTypes.audio[i]) {
            shell.ShellString('\n        static get' + loaderTypes.audio[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.audio[i][t] + '\'); };').toEnd(assetsClassFile);
        }

        shell.ShellString('\n    }').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Audiosprites {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.audiosprite).length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in loaderTypes.audiosprite) {
        for (var t in loaderTypes.audiosprite[i]) {
            var dataFile = ('assets/' + i + '.' + loaderTypes.audiosprite[i][t]);
            var fileData = null;
            var json = null;
            var sprite = null;

            if (jsonExtensions.indexOf(loaderTypes.audiosprite[i][t]) !== -1) {
                shell.ShellString('\n    enum ' + toPascalCase(i) + 'Sprites {').toEnd(assetsClassFile);

                try {
                    fileData = fs.readFileSync(dataFile, 'ascii');
                    json = JSON.parse(fileData);

                    for (var h in json['spritemap']) {
                        sprite = (h);
                        shell.ShellString('\n        ' + toPascalCase(sprite) + ' = <any>\'' + sprite + '\',').toEnd(assetsClassFile);
                    }
                } catch (e) {
                    console.log('Audiosprite Data File Error: ', e);
                }

                shell.ShellString('\n    }').toEnd(assetsClassFile);
            }
        }

        shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
        shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);
        for (var t in loaderTypes.audiosprite[i]) {
            shell.ShellString('\n        static get' + loaderTypes.audiosprite[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.audiosprite[i][t] + '\'); };').toEnd(assetsClassFile);
        }
        shell.ShellString('\n\n        static Sprites = ' + toPascalCase(i) + 'Sprites;').toEnd(assetsClassFile);
        shell.ShellString('\n    }').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace GoogleWebFonts {').toEnd(assetsClassFile);
var webFontsToUse = JSON.parse(webpackConfig.plugins[webpackConfig.plugins.findIndex(function(element) { return (element instanceof webpack.DefinePlugin); })].definitions.GOOGLE_WEB_FONTS);
if (!webFontsToUse.length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in webFontsToUse) {
        shell.ShellString('\n    export const ' + toPascalCase(webFontsToUse[i]) + ': string = \'' + webFontsToUse[i] + '\';').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);


shell.ShellString('export namespace CustomWebFonts {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.font).length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in loaderTypes.font) {
        shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
        shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

        var cssFileData = fs.readFileSync(('assets/' + i + '.css'), 'ascii');
        var family = /font-family:(\s)*('|")(\w*\W*)('|")/g.exec(cssFileData)[3];
        shell.ShellString('\n        static getFamily(): string { return \'' + family + '\'; };\n').toEnd(assetsClassFile);

        for (var t in loaderTypes.font[i]) {
            shell.ShellString('\n        static get' + loaderTypes.font[i][t].toUpperCase() + '(): string { return require(\'!file-loader?name=assets/fonts/[name].[ext]!assets/' + i + '.' + loaderTypes.font[i][t] + '\'); };').toEnd(assetsClassFile);
        }

        shell.ShellString('\n    }').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace BitmapFonts {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.bitmap_font).length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in loaderTypes.bitmap_font) {
        shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
        shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

        for (var t in loaderTypes.bitmap_font[i]) {
            shell.ShellString('\n        static get' + loaderTypes.bitmap_font[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.bitmap_font[i][t] + '\'); };').toEnd(assetsClassFile);
        }

        shell.ShellString('\n    }').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace JSON {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.json).length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in loaderTypes.json) {
        shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
        shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

        for (var t in loaderTypes.json[i]) {
            shell.ShellString('\n        static get' + loaderTypes.json[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.json[i][t] + '\'); };').toEnd(assetsClassFile);
        }

        shell.ShellString('\n    }').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace XML {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.xml).length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in loaderTypes.xml) {
        shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
        shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

        for (var t in loaderTypes.xml[i]) {
            shell.ShellString('\n        static get' + loaderTypes.xml[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.xml[i][t] + '\'); };').toEnd(assetsClassFile);
        }

        shell.ShellString('\n    }').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Text {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.text).length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in loaderTypes.text) {
        shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
        shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

        for (var t in loaderTypes.text[i]) {
            shell.ShellString('\n        static get' + loaderTypes.text[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.text[i][t] + '\'); };').toEnd(assetsClassFile);
        }

        shell.ShellString('\n    }').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Misc {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.misc).length) {
    shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
    for (var i in loaderTypes.misc) {
        shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
        shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; };\n').toEnd(assetsClassFile);

        for (var t in loaderTypes.misc[i]) {
            shell.ShellString('\n        static get' + loaderTypes.misc[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.misc[i][t] + '\'); };').toEnd(assetsClassFile);
        }

        shell.ShellString('\n    }').toEnd(assetsClassFile);
    }
}
shell.ShellString('\n}\n').toEnd(assetsClassFile);
