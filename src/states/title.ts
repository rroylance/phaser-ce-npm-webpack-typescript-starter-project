export default class Title extends Phaser.State {
    private backgroundTemplateSprite: Phaser.Sprite = null;
    private welcomeText: Phaser.Text = null;

    public preload(): void {
        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'background_template');
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.welcomeText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'welcome to my template!', {
            font: '50px Barrio'
        });
        this.welcomeText.anchor.setTo(0.5);
    }

    public create(): void {
        this.game.camera.flash(0x000000, 1000);
    }
}
