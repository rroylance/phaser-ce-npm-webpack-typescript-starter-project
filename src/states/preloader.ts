export default class Preloader extends Phaser.State {
    private preloadBarSprite: Phaser.Sprite = null;
    private preloadFrameSprite: Phaser.Sprite = null;

    public preload(): void {
        this.preloadBarSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preload_bar');
        this.preloadBarSprite.anchor.setTo(0, 0.5);
        this.preloadBarSprite.x -= this.preloadBarSprite.width * 0.5;

        this.preloadFrameSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preload_frame');
        this.preloadFrameSprite.anchor.setTo(0.5);

        this.game.load.image('background_template', 'assets/images/background_template.png');

        this.game.load.setPreloadSprite(this.preloadBarSprite);
    }

    public create(): void {
        this.game.camera.onFadeComplete.addOnce(this.loadTitle, this);
        this.game.camera.fade(0x000000, 1000);
    }

    private loadTitle(): void {
        this.game.state.start('title');
    }
}
