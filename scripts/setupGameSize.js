var PNGImage = require('pngjs-image');
var commander = require('commander');
require('shelljs/global');

var defaultWidth = 800;
var defaultHeight = 500;
var defaultAspectRatio = 1.6;

commander
    .option('--width <val>', 'Base width of your game (Default: ' + defaultWidth + ')', function (val) {
        return parseInt(val, 10);
    }, -1)
    .option('--height <val>', 'Base height of your game (Default: ' + defaultHeight + ')', function (val) {
        return parseInt(val, 10);
    }, -1)
    .option('--no-png', 'Do not create the template background png')
    .parse(process.argv);

var baseWidth = Math.round(commander.width);
var baseHeight = Math.round(commander.height);

if (baseWidth === -1 && baseHeight === -1) {
    baseWidth = defaultWidth;
    baseHeight = defaultHeight;
} else if (baseWidth === -1) {
    baseWidth = Math.round(baseHeight * defaultAspectRatio);
} else if (baseHeight === -1) {
    baseHeight = Math.round(baseWidth / defaultAspectRatio);
} else if (baseWidth < baseHeight) {
    var temp = baseHeight;
    baseHeight = baseWidth;
    baseWidth = temp;
}

var providedAspectRatio = parseFloat((baseWidth / baseHeight).toFixed(2));
if (providedAspectRatio !== defaultAspectRatio) {
    throw 'Base width and height must result in a ' + defaultAspectRatio + ' aspect ratio (width / height).\nYou only need to provide either width or height and the oher will be caculated for you.';
}

// Calculated based of the long and narrow (aspect ratio wise) iOS device, the iPhone 5 (1136 x 640)
var maxWidth = Math.round(1136 * (baseHeight / 640));
// Calculated based of the short and wide (aspect ratio wise) iOS device, the iPad (1024 x 768)
var maxHeight = Math.round(768 * (baseWidth / 1024));
var midHeight = Math.round(640 * (baseWidth / 960));

var maxWidthDifferenceHalf = Math.round((maxWidth - baseWidth) * 0.5);
var maxHeightDifferenceHalf = Math.round((maxHeight - baseHeight) * 0.5);
var midHeightDifferenceHalf = Math.round((midHeight - baseHeight) * 0.5);

var image = PNGImage.createImage(maxWidth, maxHeight);

var greenColor = { red: 0, green: 255, blue: 0, alpha: 100 };
var redColor = { red: 255, green: 0, blue: 0, alpha: 100 };
var blueColor = { red: 0, green: 0, blue: 255, alpha: 100 };
var yellowColor = { red: 255, green: 255, blue: 0, alpha: 100 };
var greyColor = { red: 128, green: 128, blue: 128, alpha: 100 };

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

ls('webpack.*.config.js').forEach(function (file) {
    sed('-i', /\/\*\[\[DEFAULT_GAME_WIDTH\*\/[0-9]*\/\*DEFAULT_GAME_WIDTH\]\]\*\//, '/*[[DEFAULT_GAME_WIDTH*/' + baseWidth + '/*DEFAULT_GAME_WIDTH]]*/', file);
    sed('-i', /\/\*\[\[DEFAULT_GAME_HEIGHT\*\/[0-9]*\/\*DEFAULT_GAME_HEIGHT\]\]\*\//, '/*[[DEFAULT_GAME_HEIGHT*/' + baseHeight + '/*DEFAULT_GAME_HEIGHT]]*/', file);
    sed('-i', /\/\*\[\[MAX_GAME_WIDTH\*\/[0-9]*\/\*MAX_GAME_WIDTH\]\]\*\//, '/*[[MAX_GAME_WIDTH*/' + maxWidth + '/*MAX_GAME_WIDTH]]*/', file);
    sed('-i', /\/\*\[\[MAX_GAME_HEIGHT\*\/[0-9]*\/\*MAX_GAME_HEIGHT\]\]\*\//, '/*[[MAX_GAME_HEIGHT*/' + maxHeight + '/*MAX_GAME_HEIGHT]]*/', file);
});

if (!commander.noPng) {
    image.writeImage('./assets/images/background_template.png', function (error) {
        if (error) {
            throw error;
        }
    });
}