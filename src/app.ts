(global as any).p2 = require('p2');
(global as any).PIXI = require('pixi');
(global as any).Phaser = require('phaser');

import * as WebFontLoader from 'webfontloader';

import Boot from './states/boot';
import Preloader from './states/preloader';
import Title from './states/title';
import * as Utils from './utils/utils';

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
    let gameWidth: number = DEFAULT_GAME_WIDTH;
    let gameHeight: number = DEFAULT_GAME_HEIGHT;

    if (SCALE_MODE === 'USER_SCALE') {
        let screenMetrics: Utils.ScreenMetrics = Utils.ScreenUtils.calculateScreenMetrics(gameWidth, gameHeight);

        gameWidth = screenMetrics.gameWidth;
        gameHeight = screenMetrics.gameHeight;
    }

    // There are a few more options you can set if needed, just take a look at Phaser.IGameCongig
    let gameConfig: Phaser.IGameConfig = {
        width: gameWidth,
        height: gameHeight,
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
