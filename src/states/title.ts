import * as Assets from '../assets';

export default class Title extends Phaser.State {
    private backgroundTemplateSprite: Phaser.Sprite = null;
    private googleFontText: Phaser.Text = null;
    private localFontText: Phaser.Text = null;
    private pixelateShader: Phaser.Filter = null;
    private bitmapFontText: Phaser.BitmapText = null;
    private blurXFilter: Phaser.Filter.BlurX = null;
    private blurYFilter: Phaser.Filter.BlurY = null;
    private sfxAudiosprite: Phaser.AudioSprite = null;
    private mummySpritesheet: Phaser.Sprite = null;
    private sfxLaserSounds: Assets.Audiosprites.AudiospritesSfx.Sprites[] = null;

    public create(): void {
        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesBackgroundTemplate.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.googleFontText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'Google Web Fonts', {
            font: '50px ' + Assets.GoogleWebFonts.Barrio
        });
        this.googleFontText.anchor.setTo(0.5);

        this.localFontText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Local Fonts + Shaders .frag (Pixelate here)!', {
            font: '30px ' + Assets.CustomWebFonts.Fonts2DumbWebfont.getFamily()
        });
        this.localFontText.anchor.setTo(0.5);

        this.pixelateShader = new Phaser.Filter(this.game, null, this.game.cache.getShader(Assets.Shaders.ShadersPixelate.getName()));
        this.localFontText.filters = [this.pixelateShader];

        this.bitmapFontText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 100, Assets.BitmapFonts.FontsFontFnt.getName(), 'Bitmap Fonts + Filters .js (Blur here)!', 40);
        this.bitmapFontText.anchor.setTo(0.5);

        this.blurXFilter = this.game.add.filter(Assets.Scripts.ScriptsBlurX.getName()) as Phaser.Filter.BlurX;
        this.blurXFilter.blur = 8;
        this.blurYFilter = this.game.add.filter(Assets.Scripts.ScriptsBlurY.getName()) as Phaser.Filter.BlurY;
        this.blurYFilter.blur = 2;

        this.bitmapFontText.filters = [this.blurXFilter, this.blurYFilter];

        this.mummySpritesheet = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 175, Assets.Spritesheets.SpritesheetsMetalslugMummy374518.getName());
        this.mummySpritesheet.animations.add('walk');
        this.mummySpritesheet.animations.play('walk', 30, true);

        this.sfxAudiosprite = this.game.add.audioSprite(Assets.Audiosprites.AudiospritesSfx.getName());

        // This is an example of how you can lessen the verbosity
        let availableSFX = Assets.Audiosprites.AudiospritesSfx.Sprites;
        this.sfxLaserSounds = [
            availableSFX.Laser1,
            availableSFX.Laser2,
            availableSFX.Laser3,
            availableSFX.Laser4,
            availableSFX.Laser5,
            availableSFX.Laser6,
            availableSFX.Laser7,
            availableSFX.Laser8,
            availableSFX.Laser9
        ];

        this.game.sound.play(Assets.Audio.AudioMusic.getName(), 0.2, true);

        this.backgroundTemplateSprite.inputEnabled = true;
        this.backgroundTemplateSprite.events.onInputDown.add(() => {
            this.sfxAudiosprite.play(Phaser.ArrayUtils.getRandomItem(this.sfxLaserSounds));
        });

        this.game.camera.flash(0x000000, 1000);
    }
}
