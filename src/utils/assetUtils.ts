import * as Assets from '../assets';

export class Loader {
    private static game: Phaser.Game = null;

    private static loadImages() {
        for (let image in Assets.Images) {
            if (!this.game.cache.checkImageKey(Assets.Images[image].getName())) {
                for (let option in Assets.Images[image]) {
                    if (option !== 'getName') {
                        this.game.load.image(Assets.Images[image].getName(), Assets.Images[image][option]());
                    }
                }
            }
        }
    }

    private static loadAtlases() {
        for (let atlas in Assets.Atlases) {
            if (!this.game.cache.checkImageKey(Assets.Atlases[atlas].getName())) {
                for (let option in Assets.Atlases[atlas]) {
                    if (option === 'getXML') {
                        this.game.load.atlasXML(Assets.Atlases[atlas].getName(), Assets.Atlases[atlas].getPNG(), Assets.Atlases[atlas].getXML());
                    } else if (option === 'getJSONArray') {
                        this.game.load.atlasJSONArray(Assets.Atlases[atlas].getName(), Assets.Atlases[atlas].getPNG(), Assets.Atlases[atlas].getJSONArray());
                    } else if (option === 'getJSONHash') {
                        this.game.load.atlasJSONHash(Assets.Atlases[atlas].getName(), Assets.Atlases[atlas].getPNG(), Assets.Atlases[atlas].getJSONHash());
                    }
                }
            }
        }
    }

    private static loadAudio() {
        for (let audio in Assets.Audio) {
            if (!this.game.cache.checkSoundKey(Assets.Audio[audio].getName())) {
                let audioTypeArray = [];

                for (let option in Assets.Audio[audio]) {
                    if (option !== 'getName') {
                        audioTypeArray.push(Assets.Audio[audio][option]());
                    }
                }

                this.game.load.audio(Assets.Audio[audio].getName(), audioTypeArray, true);
            }
        }
    }

    private static loadAudiosprites() {
        for (let audio in Assets.Audiosprites) {
            if (!this.game.cache.checkSoundKey(Assets.Audiosprites[audio].getName())) {
                let audioTypeArray = [];

                for (let option in Assets.Audiosprites[audio]) {
                    if (option !== 'getName' && option !== 'getJSON') {
                        audioTypeArray.push(Assets.Audiosprites[audio][option]());
                    }
                }

                this.game.load.audiosprite(Assets.Audiosprites[audio].getName(), audioTypeArray, Assets.Audiosprites[audio].getJSON(), null, true);
            }
        }
    }

    private static loadBitmapFonts() {
        for (let font in Assets.BitmapFonts) {
            if (!this.game.cache.checkBitmapFontKey(Assets.BitmapFonts[font].getName())) {
                let imageOption = null;
                let dataOption = null;

                for (let option in Assets.BitmapFonts[font]) {
                    if (option === 'getXML' || option === 'getFNT') {
                        dataOption = option;
                    } else if (option !== 'getName') {
                        imageOption = option;
                    }
                }

                this.game.load.bitmapFont(Assets.BitmapFonts[font].getName(), Assets.BitmapFonts[font][imageOption](), Assets.BitmapFonts[font][dataOption]());
            }
        }
    }

    private static loadJSON() {
        for (let json in Assets.JSON) {
            if (!this.game.cache.checkJSONKey(Assets.JSON[json].getName())) {
                this.game.load.json(Assets.JSON[json].getName(), Assets.JSON[json].getJSON(), true);
            }
        }
    }

    private static loadXML() {
        for (let xml in Assets.XML) {
            if (!this.game.cache.checkJSONKey(Assets.XML[xml].getName())) {
                this.game.load.xml(Assets.XML[xml].getName(), Assets.XML[xml].getXML(), true);
            }
        }
    }

    private static loadText() {
        for (let text in Assets.Text) {
            if (!this.game.cache.checkJSONKey(Assets.Text[text].getName())) {
                this.game.load.xml(Assets.Text[text].getName(), Assets.Text[text].getText(), true);
            }
        }
    }

    public static loadAllAssets(game: Phaser.Game, onComplete?: Function, onCompleteContext?: any) {
        this.game = game;

        if (onComplete) {
            this.game.load.onLoadComplete.addOnce(onComplete, onCompleteContext);
        }

        this.loadImages();
        this.loadAtlases();
        this.loadAudio();
        this.loadAudiosprites();
        this.loadBitmapFonts();
        this.loadJSON();
        this.loadXML();
        this.loadText();
    }
}
