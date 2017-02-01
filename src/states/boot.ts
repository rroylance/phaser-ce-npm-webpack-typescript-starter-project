export default class Boot extends Phaser.State {
    public preload(): void {
        // Load any assets you need for your preloader state here.
        this.game.load.image('preload_bar', 'assets/images/preload_bar.png');
        this.game.load.image('preload_frame', 'assets/images/preload_frame.png');
    }

    public create(): void {
        // Do anything here that you need to be setup immediately, before the game actually starts doing anything.
        // Orientation forcing, disabling multitouch, pause on focus lost... for example

        if (this.game.device.desktop) {
            // Any desktop specific stuff here
        } else {
            // Any mobile specific stuff here
        }

        // Use DEBUG to wrap code that should only be included in a DEBUG build of the game
        // Use GIT_REVISION as an identifier when testing builds
        console.log('DEBUG: ' + DEBUG, 'GIT_REVISION: ' + GIT_REVISION);

        this.game.state.start('preloader');
    }
}
