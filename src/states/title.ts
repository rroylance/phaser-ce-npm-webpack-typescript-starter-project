export default class Title extends Phaser.State {
    public create(): void {
        this.game.camera.flash(0x000000, 1000);
    }
}
