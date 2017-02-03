(global as any).p2 = require('../node_modules/phaser-ce/build/custom/p2.js');
(global as any).PIXI = require('../node_modules/phaser-ce/build/custom/pixi.js');
(global as any).Phaser = require('../node_modules/phaser-ce/build/custom/phaser-split.js');

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

window.onload = () => {
    let screenMetrics: Utils.ScreenMetrics = Utils.ScreenUtils.calculateScreenMetrics(800, 500);

    let gameConfig: Phaser.IGameConfig = {
        width: screenMetrics.gameWidth,
        height: screenMetrics.gameHeight,
        renderer: Phaser.AUTO,
        parent: '',
        resolution: 1
    };

    let app = new App(gameConfig);
};
