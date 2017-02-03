(global as any).p2 = require('../node_modules/phaser-ce/build/custom/p2.js');
(global as any).PIXI = require('../node_modules/phaser-ce/build/custom/pixi.js');
(global as any).Phaser = require('../node_modules/phaser-ce/build/custom/phaser-split.js');

import Boot from './states/boot';
import Preloader from './states/preloader';
import Title from './states/title';
import * as Utils from './utils/utils';

import WebFontLoader = require('webfontloader');

class App extends Phaser.Game {
    constructor(config: Phaser.IGameConfig) {
        super (config);

        this.state.add('boot', Boot);
        this.state.add('preloader', Preloader);
        this.state.add('title', Title);

        this.state.start('boot');
    }
}

function startApp(): void {
    let screenMetrics: Utils.ScreenMetrics = Utils.ScreenUtils.calculateScreenMetrics(800, 500);

    // There are a few more options you can set if needed, just take a look at Phaser.IGameCongig
    let gameConfig: Phaser.IGameConfig = {
        width: screenMetrics.gameWidth,
        height: screenMetrics.gameHeight,
        renderer: Phaser.AUTO,
        parent: '',
        resolution: 1
    };

    let app = new App(gameConfig);
}

window.onload = () => {
    // Add or remove entries in this array to change which fonts are loaded
    let webFontsToLoad: string[] = [
        'Barrio'
    ];

    if (webFontsToLoad.length > 0) {
        // Load the fonts defined in webFontsToLoad from Google Web Fonts then start the game knowing the fonts are available
        WebFontLoader.load({
            active: startApp,
            google: {
                families: webFontsToLoad
            }
        });
    } else {
        // Just start the game, we don't need any additional fonts
        startApp();
    }
};
