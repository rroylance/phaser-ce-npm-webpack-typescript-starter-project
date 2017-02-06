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

var directoryStructure = {};

shell.ls('assets/**/*.*').forEach(function(file) {
   var splitFilePath = file.split('/');

   var directoryStructureParent = directoryStructure;

   while(splitFilePath.length > 0) {
       var filePathSegment = splitFilePath.shift();
       if (filePathSegment === 'assets') {
           continue;
       }

       var fileExtension = filePathSegment.split('.');

       if (fileExtension.length > 1) {
           fileExtension = fileExtension[fileExtension.length - 1];
           filePathSegment = filePathSegment.replace('.' + fileExtension, '');

           directoryStructureParent[filePathSegment] = (directoryStructureParent[filePathSegment] || {
               path: '',
               extensions: []
           });
           directoryStructureParent[filePathSegment].path = file.replace('.' + fileExtension, '');
           directoryStructureParent[filePathSegment].extensions.push('\'' + fileExtension + '\'');
       } else {
           directoryStructureParent[filePathSegment] = (directoryStructureParent[filePathSegment] || {});
       }

       directoryStructureParent = directoryStructureParent[filePathSegment];
   }
});

shell.ShellString(JSON.stringify(directoryStructure)).to('assets.json');

var assetsClassFile = 'src/assets.ts';
shell.rm(assetsClassFile);

//TODO Traverse assets.json and export assets.ts
