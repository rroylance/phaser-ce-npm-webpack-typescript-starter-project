import * as Assets from '../assets';

export class Loader {
    private static game: Phaser.Game = null;
    private static soundKeys: string[] = [];
    private static soundExtensionsPreference: string[] = SOUND_EXTENSIONS_PREFERENCE;

    private static loadImages() {
        for (let image in Assets.Images) {
            if (!this.game.cache.checkImageKey(Assets.Images[image].getName())) {
                for (let option of Object.getOwnPropertyNames(Assets.Images[image])) {
                    if (option !== 'getName' && option.includes('get')) {
                        this.game.load.image(Assets.Images[image].getName(), Assets.Images[image][option]());
                    }
                }
            }
        }
    }

    private static loadSpritesheets() {
        for (let spritesheet in Assets.Spritesheets) {
            if (!this.game.cache.checkImageKey(Assets.Spritesheets[spritesheet].getName())) {
                let imageOption = null;

                for (let option of Object.getOwnPropertyNames(Assets.Spritesheets[spritesheet])) {
                    if (option !== 'getName' && option !== 'getFrameWidth' && option !== 'getFrameHeight' && option !== 'getFrameMax' && option !== 'getMargin' && option !== 'getSpacing' && option.includes('get')) {
                        imageOption = option;
                    }
                }
                this.game.load.spritesheet(Assets.Spritesheets[spritesheet].getName(), Assets.Spritesheets[spritesheet][imageOption](), Assets.Spritesheets[spritesheet].getFrameWidth(), Assets.Spritesheets[spritesheet].getFrameHeight(), Assets.Spritesheets[spritesheet].getFrameMax(), Assets.Spritesheets[spritesheet].getMargin(), Assets.Spritesheets[spritesheet].getSpacing());
            }
        }
    }

    private static loadAtlases() {
        for (let atlas in Assets.Atlases) {
            if (!this.game.cache.checkImageKey(Assets.Atlases[atlas].getName())) {
                let imageOption = null;
                let dataOption = null;

                for (let option of Object.getOwnPropertyNames(Assets.Atlases[atlas])) {
                    if ((option === 'getXML' || option === 'getJSONArray' || option === 'getJSONHash') && option.includes('get')) {
                        dataOption = option;
                    } else if (option !== 'getName' && option !== 'Frames' && option.includes('get')) {
                        imageOption = option;
                    }
                }

                if (dataOption === 'getXML') {
                    this.game.load.atlasXML(Assets.Atlases[atlas].getName(), Assets.Atlases[atlas][imageOption](), Assets.Atlases[atlas].getXML());
                } else if (dataOption === 'getJSONArray') {
                    this.game.load.atlasJSONArray(Assets.Atlases[atlas].getName(), Assets.Atlases[atlas][imageOption](), Assets.Atlases[atlas].getJSONArray());
                } else if (dataOption === 'getJSONHash') {
                    this.game.load.atlasJSONHash(Assets.Atlases[atlas].getName(), Assets.Atlases[atlas][imageOption](), Assets.Atlases[atlas].getJSONHash());
                }
            }
        }
    }

    private static orderAudioSourceArrayBasedOnSoundExtensionPreference(soundSourceArray: string[]): string[] {
        let orderedSoundSourceArray: string[] = [];

        for (let e in this.soundExtensionsPreference) {
            let sourcesWithExtension: string[] = soundSourceArray.filter((el) => {
                return (el.substring(el.lastIndexOf('.') + 1, el.length) === this.soundExtensionsPreference[e]);
            });

            orderedSoundSourceArray = orderedSoundSourceArray.concat(sourcesWithExtension);
        }

        return orderedSoundSourceArray;
    }

    private static loadAudio() {
        for (let audio in Assets.Audio) {
            let soundName = Assets.Audio[audio].getName();
            this.soundKeys.push(soundName);

            if (!this.game.cache.checkSoundKey(soundName)) {
                let audioTypeArray = [];

                for (let option of Object.getOwnPropertyNames(Assets.Audio[audio])) {
                    if (option !== 'getName' && option.includes('get')) {
                        audioTypeArray.push(Assets.Audio[audio][option]());
                    }
                }

                audioTypeArray = this.orderAudioSourceArrayBasedOnSoundExtensionPreference(audioTypeArray);

                this.game.load.audio(soundName, audioTypeArray, true);
            }
        }
    }

    private static loadAudiosprites() {
        for (let audio in Assets.Audiosprites) {
            let soundName = Assets.Audiosprites[audio].getName();
            this.soundKeys.push(soundName);

            if (!this.game.cache.checkSoundKey(soundName)) {
                let audioTypeArray = [];

                for (let option of Object.getOwnPropertyNames(Assets.Audiosprites[audio])) {
                    if (option !== 'getName' && option !== 'getJSON' && option !== 'Sprites' && option.includes('get')) {
                        audioTypeArray.push(Assets.Audiosprites[audio][option]());
                    }
                }

                audioTypeArray = this.orderAudioSourceArrayBasedOnSoundExtensionPreference(audioTypeArray);

                this.game.load.audiosprite(soundName, audioTypeArray, Assets.Audiosprites[audio].getJSON(), null, true);
            }
        }
    }

    private static loadBitmapFonts() {
        for (let font in Assets.BitmapFonts) {
            if (!this.game.cache.checkBitmapFontKey(Assets.BitmapFonts[font].getName())) {
                let imageOption = null;
                let dataOption = null;

                for (let option of Object.getOwnPropertyNames(Assets.BitmapFonts[font])) {
                    if ((option === 'getXML' || option === 'getFNT') && option.includes('get')) {
                        dataOption = option;
                    } else if (option !== 'getName' && option.includes('get')) {
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
            if (!this.game.cache.checkXMLKey(Assets.XML[xml].getName())) {
                this.game.load.xml(Assets.XML[xml].getName(), Assets.XML[xml].getXML(), true);
            }
        }
    }

    private static loadText() {
        for (let text in Assets.Text) {
            if (!this.game.cache.checkTextKey(Assets.Text[text].getName())) {
                this.game.load.text(Assets.Text[text].getName(), Assets.Text[text].getTXT(), true);
            }
        }
    }

    private static loadScripts() {
        for (let script in Assets.Scripts) {
            this.game.load.script(Assets.Scripts[script].getName(), Assets.Scripts[script].getJS());
        }
    }

    private static loadShaders() {
        for (let shader in Assets.Shaders) {
            if (!this.game.cache.checkShaderKey(Assets.Shaders[shader].getName())) {
                this.game.load.shader(Assets.Shaders[shader].getName(), Assets.Shaders[shader].getFRAG(), true);
            }
        }
    }

    private static loadMisc() {
        for (let misc in Assets.Misc) {
            if (!this.game.cache.checkBinaryKey(Assets.Misc[misc].getName())) {
                this.game.load.binary(Assets.Misc[misc].getName(), Assets.Misc[misc].getFile());
            }
        }
    }

    public static loadAllAssets(game: Phaser.Game, onComplete?: Function, onCompleteContext?: any) {
        this.game = game;

        if (onComplete) {
            this.game.load.onLoadComplete.addOnce(onComplete, onCompleteContext);
        }

        this.loadImages();
        this.loadSpritesheets();
        this.loadAtlases();
        this.loadAudio();
        this.loadAudiosprites();
        this.loadBitmapFonts();
        this.loadJSON();
        this.loadXML();
        this.loadText();
        this.loadScripts();
        this.loadShaders();
        this.loadMisc();

        if ((this.game.load as any)._fileList.length === 0) {
            this.game.load.onLoadComplete.dispatch();
        }
    }

    public static waitForSoundDecoding(onComplete: Function, onCompleteContext?: any) {
        if (this.soundKeys.length > 0) {
            this.game.sound.setDecodedCallback(this.soundKeys, onComplete, onCompleteContext);
        } else {
            onComplete.call(onCompleteContext);
        }
    }
}
