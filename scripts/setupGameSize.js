var PNGImage = require('pngjs-image');
var ImageJS = require('imagejs');
var commander = require('commander');
var shell = require('shelljs');

var filename = './assets/images/background_template.png';
var defaultWidth = 800;
var defaultHeight = 500;
var defaultAspectRatio = 1.6;
var defaultScaleMode = 'USER_SCALE';
var possibleScaleModes = ['USER_SCALE', 'SHOW_ALL', 'EXACT_FIT', 'NO_SCALE', 'RESIZE'];

commander
    .option('--width <val>', 'Base width of your game (Default: ' + defaultWidth + ')', function (val) {
        return parseInt(val, 10);
    }, -1)
    .option('--height <val>', 'Base height of your game (Default: ' + defaultHeight + ')', function (val) {
        return parseInt(val, 10);
    }, -1)
    .option('--aspect-ratio <val>', 'Aspect ratio of your game (Default: ' + defaultAspectRatio + ')', function (val) {
        return parseFloat(val);
    }, -1)
    .option('--scale-mode <val>', 'Scale mode of your game (Default: ' + defaultHeight + ') [USER_SCALE, SHOW_ALL, EXACT_FIT, NO_SCALE, RESIZE]', function (val) {
        return (possibleScaleModes.indexOf(val) !== -1 ? val : null);
    }, defaultScaleMode)
    .option('--no-png', 'Do not create the template background png')
    .parse(process.argv);

var aspectRatio = commander.aspectRatio;
var baseWidth = Math.round(commander.width);
var baseHeight = Math.round(commander.height);
var maxWidth = baseWidth;
var maxHeight = baseHeight;
var midHeight = -1;
var isPortrait = false;
var scaleMode = commander.scaleMode;

if (scaleMode === null) {
    console.log('--scale-mode must be one of the available options; [USER_SCALE, SHOW_ALL, EXACT_FIT, NO_SCALE, RESIZE]');
    return;
}

var image = null;

var greenColor = {red: 0, green: 255, blue: 0, alpha: 100};
var redColor = {red: 255, green: 0, blue: 0, alpha: 100};
var blueColor = {red: 0, green: 0, blue: 255, alpha: 100};
var yellowColor = {red: 255, green: 255, blue: 0, alpha: 100};
var greyColor = {red: 128, green: 128, blue: 128, alpha: 100};

if (scaleMode === 'USER_SCALE') {
    // The game Display is scaled according to the user-specified scale set by setUserScale.

    if (aspectRatio === -1) {
        aspectRatio = defaultAspectRatio;
    }

    if (baseWidth === -1 && baseHeight === -1) {
        baseWidth = defaultWidth;
        baseHeight = defaultHeight;
    } else if (baseWidth === -1) {
        baseWidth = Math.round(baseHeight * aspectRatio);
    } else if (baseHeight === -1) {
        baseHeight = Math.round(baseWidth / aspectRatio);
    } 
    
    if (baseWidth < baseHeight) {
        var temp = baseHeight;
        baseHeight = baseWidth;
        baseWidth = temp;

        isPortrait = true;
    }

    var providedAspectRatio = parseFloat((baseWidth / baseHeight).toFixed(3));
    if (aspectRatio < 1) {
        aspectRatio = parseFloat((baseWidth / baseHeight).toFixed(3));
    }
    if (providedAspectRatio !== aspectRatio) {
        throw 'Base width and height must result in a ' + aspectRatio + ' aspect ratio (width / height).\nYou only need to provide either width or height and the other will be calculated for you.';
    }

    var iPhone4Resolution = {
        width: 960,
        height: 640
    };
    
    var iPhone5Resolution = {
        width: 1136,
        height: 640
    }

    var iPadResolution = {
        width: 1024,
        height: 768
    }

    // Calculated based of the long and narrow (aspect ratio wise) iOS device, the iPhone 5 (1136 x 640)
    maxWidth = Math.round(iPhone5Resolution.width * (baseHeight / iPhone5Resolution.height));
    // Calculated based of the short and wide (aspect ratio wise) iOS device, the iPad (1024 x 768)
    maxHeight = Math.round(iPadResolution.height * (baseWidth / iPadResolution.width));
    // Calculated based of the middle (aspect ratio wise) iOS device, the iPhone 4 (960 x 640)
    midHeight = Math.round(iPhone4Resolution.height * (baseWidth / iPhone4Resolution.width));

    image = PNGImage.createImage(maxWidth, maxHeight);

    var maxWidthDifferenceHalf = Math.round((maxWidth - baseWidth) * 0.5);
    var maxHeightDifferenceHalf = Math.round((maxHeight - baseHeight) * 0.5);
    var midHeightDifferenceHalf = Math.round((midHeight - baseHeight) * 0.5);

    // Draw green 16:10 (safe) area
    image.fillRect(maxWidthDifferenceHalf, maxHeightDifferenceHalf, baseWidth, baseHeight, greenColor);

    // Draw blue 16:9 area
    image.fillRect(0, maxHeightDifferenceHalf, maxWidthDifferenceHalf, baseHeight, blueColor);
    image.fillRect(maxWidthDifferenceHalf + baseWidth, maxHeightDifferenceHalf, maxWidthDifferenceHalf, baseHeight, blueColor);

    // Draw yellow 3:2 area
    image.fillRect(maxWidthDifferenceHalf, maxHeightDifferenceHalf - midHeightDifferenceHalf, baseWidth, midHeightDifferenceHalf, yellowColor);
    image.fillRect(maxWidthDifferenceHalf, maxHeightDifferenceHalf + baseHeight, baseWidth, midHeightDifferenceHalf, yellowColor);

    // Draw red 4:3 area
    image.fillRect(maxWidthDifferenceHalf, 0, baseWidth, maxHeightDifferenceHalf - midHeightDifferenceHalf, redColor);
    image.fillRect(maxWidthDifferenceHalf, maxHeightDifferenceHalf + baseHeight + midHeightDifferenceHalf, baseWidth, maxHeightDifferenceHalf, redColor);

    // Draw grey unseen corners
    image.fillRect(0, 0, maxWidthDifferenceHalf, maxHeightDifferenceHalf, greyColor);
    image.fillRect(0, maxHeightDifferenceHalf + baseHeight, maxWidthDifferenceHalf, maxHeightDifferenceHalf, greyColor);
    image.fillRect(maxWidthDifferenceHalf + baseWidth, 0, maxWidthDifferenceHalf, maxHeightDifferenceHalf, greyColor);
    image.fillRect(maxWidthDifferenceHalf + baseWidth, maxHeightDifferenceHalf + baseHeight, maxWidthDifferenceHalf, maxHeightDifferenceHalf, greyColor);
} else {
    if (baseWidth === -1) {
        baseWidth = defaultWidth;
        maxWidth = baseWidth;
    }

    if (baseHeight === -1) {
        baseHeight = defaultHeight;
        maxHeight = baseHeight;
    }

    if (baseWidth < baseHeight) {
        var temp = baseHeight;
        baseHeight = baseWidth;
        baseWidth = temp;

        maxWidth = baseWidth;
        maxHeight = baseHeight;

        isPortrait = true;
    }

    image = PNGImage.createImage(maxWidth, maxHeight);
    image.fillRect(0, 0, maxWidth, maxHeight, greenColor);
}

if (isPortrait) {
    var temp = baseHeight;
    baseHeight = baseWidth;
    baseWidth = temp;

    var temp = maxHeight;
    maxHeight = maxWidth;
    maxWidth = temp;
}

shell.ls('webpack.*.config.js').forEach(function (file) {
    shell.sed('-i', /\/\*\[\[DEFAULT_GAME_WIDTH\*\/\S*\/\*DEFAULT_GAME_WIDTH\]\]\*\//, '/*[[DEFAULT_GAME_WIDTH*/' + baseWidth + '/*DEFAULT_GAME_WIDTH]]*/', file);
    shell.sed('-i', /\/\*\[\[DEFAULT_GAME_HEIGHT\*\/\S*\/\*DEFAULT_GAME_HEIGHT\]\]\*\//, '/*[[DEFAULT_GAME_HEIGHT*/' + baseHeight + '/*DEFAULT_GAME_HEIGHT]]*/', file);
    shell.sed('-i', /\/\*\[\[MAX_GAME_WIDTH\*\/\S*\/\*MAX_GAME_WIDTH\]\]\*\//, '/*[[MAX_GAME_WIDTH*/' + maxWidth + '/*MAX_GAME_WIDTH]]*/', file);
    shell.sed('-i', /\/\*\[\[MAX_GAME_HEIGHT\*\/\S*\/\*MAX_GAME_HEIGHT\]\]\*\//, '/*[[MAX_GAME_HEIGHT*/' + maxHeight + '/*MAX_GAME_HEIGHT]]*/', file);
    shell.sed('-i', /\/\*\[\[SCALE_MODE\*\/\S*\/\*SCALE_MODE\]\]\*\//, '/*[[SCALE_MODE*/\'' + scaleMode + '\'/*SCALE_MODE]]*/', file);
});

shell.ls('electron-main.js').forEach(function (file) {
    shell.sed('-i', /\/\*\[\[DEFAULT_GAME_WIDTH\*\/\S*\/\*DEFAULT_GAME_WIDTH\]\]\*\//, '/*[[DEFAULT_GAME_WIDTH*/' + baseWidth + '/*DEFAULT_GAME_WIDTH]]*/', file);
    shell.sed('-i', /\/\*\[\[DEFAULT_GAME_HEIGHT\*\/\S*\/\*DEFAULT_GAME_HEIGHT\]\]\*\//, '/*[[DEFAULT_GAME_HEIGHT*/' + baseHeight + '/*DEFAULT_GAME_HEIGHT]]*/', file);
});

if (!commander.noPng) {
    shell.mkdir('-p', 'assets/images/');

    image.writeImage(filename, function (error) {
        if (!error && isPortrait) {
            var bitmap = new ImageJS.Bitmap();
            bitmap.readFile(filename).then(function() {
                var rotatedBitmap = bitmap.rotate({ degrees: 90, fit: "custom", width: maxWidth, height: maxHeight });
                rotatedBitmap.writeFile(filename);
            });
        }
    });
}
