import * as Assets from '../assets';
import * as AssetUtils from '../utils/assetUtils';

export default class Preloader extends Phaser.State {
    private preloadBarSprite!: Phaser.Sprite;
    private preloadFrameSprite!: Phaser.Sprite;

    public preload(): void {
        // Setup your loading screen and preload sprite (if you want a loading progress indicator) here

        AssetUtils.Loader.loadAllAssets(this.game, this.waitForSoundDecoding, this);
    }

    private waitForSoundDecoding(): void {
        AssetUtils.Loader.waitForSoundDecoding(this.startGame, this);
    }

    private startGame(): void {
        this.game.camera.onFadeComplete.addOnce(this.loadTitle, this);
        this.game.camera.fade(0x000000, 1000);
    }

    private loadTitle(): void {
        this.game.state.start('title');
    }
}
