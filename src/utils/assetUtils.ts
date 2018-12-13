import * as Assets from '../assets';

export class Loader {
    private static game: Phaser.Game;
    private static soundKeys: string[] = [];
    private static soundExtensionsPreference: string[] = SOUND_EXTENSIONS_PREFERENCE;

    private static loadImages() {
        let allImages = (Assets.Images as any);

        for (let image in allImages) {
            if (!this.game.cache.checkImageKey(allImages[image].getName())) {
                for (let option of Object.getOwnPropertyNames(allImages[image])) {
                    if (option !== 'getName' && option.includes('get')) {
                        this.game.load.image(allImages[image].getName(), allImages[image][option]());
                    }
                }
            }
        }
    }

    private static loadSpritesheets() {
        let allSpritesheets = (Assets.Spritesheets as any);

        for (let spritesheet in allSpritesheets) {
            if (!this.game.cache.checkImageKey(allSpritesheets[spritesheet].getName())) {
                let imageOption: string = '';

                for (let option of Object.getOwnPropertyNames(allSpritesheets[spritesheet])) {
                    if (option !== 'getName' && option !== 'getFrameWidth' && option !== 'getFrameHeight' && option !== 'getFrameMax' && option !== 'getMargin' && option !== 'getSpacing' && option.includes('get')) {
                        imageOption = option;
                    }
                }

                this.game.load.spritesheet(allSpritesheets[spritesheet].getName(), allSpritesheets[spritesheet][imageOption](), allSpritesheets[spritesheet].getFrameWidth(), allSpritesheets[spritesheet].getFrameHeight(), allSpritesheets[spritesheet].getFrameMax(), allSpritesheets[spritesheet].getMargin(), allSpritesheets[spritesheet].getSpacing());
            }
        }
    }

    private static loadAtlases() {
        let allAtlases = (Assets.Atlases as any);

        for (let atlas in allAtlases) {
            if (!this.game.cache.checkImageKey(allAtlases[atlas].getName())) {
                let imageOption: string = '';
                let dataOption: string = '';

                for (let option of Object.getOwnPropertyNames(allAtlases[atlas])) {
                    if ((option === 'getXML' || option === 'getJSONArray' || option === 'getJSONHash') && option.includes('get')) {
                        dataOption = option;
                    } else if (option !== 'getName' && option !== 'Frames' && option.includes('get')) {
                        imageOption = option;
                    }
                }

                if (dataOption === 'getXML') {
                    this.game.load.atlasXML(allAtlases[atlas].getName(), allAtlases[atlas][imageOption](), allAtlases[atlas].getXML());
                } else if (dataOption === 'getJSONArray') {
                    this.game.load.atlasJSONArray(allAtlases[atlas].getName(), allAtlases[atlas][imageOption](), allAtlases[atlas].getJSONArray());
                } else if (dataOption === 'getJSONHash') {
                    this.game.load.atlasJSONHash(allAtlases[atlas].getName(), allAtlases[atlas][imageOption](), allAtlases[atlas].getJSONHash());
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
        let allAudio = (Assets.Audio as  any);

        for (let audio in allAudio) {
            let soundName = allAudio[audio].getName();
            this.soundKeys.push(soundName);

            if (!this.game.cache.checkSoundKey(soundName)) {
                let audioTypeArray = [];

                for (let option of Object.getOwnPropertyNames(allAudio[audio])) {
                    if (option !== 'getName' && option.includes('get')) {
                        audioTypeArray.push(allAudio[audio][option]());
                    }
                }

                audioTypeArray = this.orderAudioSourceArrayBasedOnSoundExtensionPreference(audioTypeArray);

                this.game.load.audio(soundName, audioTypeArray, true);
            }
        }
    }

    private static loadAudiosprites() {
        let allAudiosprites = (Assets.Audiosprites as any);

        for (let audio in allAudiosprites) {
            let soundName = allAudiosprites[audio].getName();
            this.soundKeys.push(soundName);

            if (!this.game.cache.checkSoundKey(soundName)) {
                let audioTypeArray = [];

                for (let option of Object.getOwnPropertyNames(allAudiosprites[audio])) {
                    if (option !== 'getName' && option !== 'getJSON' && option !== 'Sprites' && option.includes('get')) {
                        audioTypeArray.push(allAudiosprites[audio][option]());
                    }
                }

                audioTypeArray = this.orderAudioSourceArrayBasedOnSoundExtensionPreference(audioTypeArray);

                this.game.load.audiosprite(soundName, audioTypeArray, allAudiosprites[audio].getJSON(), null, true);
            }
        }
    }

    private static loadBitmapFonts() {
        let allBitmapFonts = (Assets.BitmapFonts as any);

        for (let font in allBitmapFonts) {
            if (!this.game.cache.checkBitmapFontKey(allBitmapFonts[font].getName())) {
                let imageOption: string = '';
                let dataOption: string = '';

                for (let option of Object.getOwnPropertyNames(allBitmapFonts[font])) {
                    if ((option === 'getXML' || option === 'getFNT') && option.includes('get')) {
                        dataOption = option;
                    } else if (option !== 'getName' && option.includes('get')) {
                        imageOption = option;
                    }
                }

                this.game.load.bitmapFont(allBitmapFonts[font].getName(), allBitmapFonts[font][imageOption](), allBitmapFonts[font][dataOption]());
            }
        }
    }

    private static loadJSON() {
        let allJSON = (Assets.JSON as any);

        for (let json in allJSON) {
            if (!this.game.cache.checkJSONKey(allJSON[json].getName())) {
                this.game.load.json(allJSON[json].getName(), allJSON[json].getJSON(), true);
            }
        }
    }

    private static loadTilemapJSON() {
        let allTilemapJSON = (Assets.TilemapJSON as any);

        for (let json in allTilemapJSON) {
            if (!this.game.cache.checkTilemapKey(allTilemapJSON[json].getName())) {
                this.game.load.tilemap(allTilemapJSON[json].getName(), allTilemapJSON[json].getJSON(), null, Phaser.Tilemap.TILED_JSON);
            }
        }
    }

    private static loadXML() {
        let allXML = (Assets.XML as any);

        for (let xml in allXML) {
            if (!this.game.cache.checkXMLKey(allXML[xml].getName())) {
                this.game.load.xml(allXML[xml].getName(), allXML[xml].getXML(), true);
            }
        }
    }

    private static loadText() {
        let allText = (Assets.Text as any);

        for (let text in allText) {
            if (!this.game.cache.checkTextKey(allText[text].getName())) {
                this.game.load.text(allText[text].getName(), allText[text].getTXT(), true);
            }
        }
    }

    private static loadScripts() {
        let allScripts = (Assets.Scripts as any);

        for (let script in Assets.Scripts) {
            this.game.load.script(allScripts[script].getName(), allScripts[script].getJS());
        }
    }

    private static loadShaders() {
        let allShaders = (Assets.Shaders as any);

        for (let shader in allShaders) {
            if (!this.game.cache.checkShaderKey(allShaders[shader].getName())) {
                this.game.load.shader(allShaders[shader].getName(), allShaders[shader].getFRAG(), true);
            }
        }
    }

    private static loadMisc() {
        let allMisc = (Assets.Misc as any);

        for (let misc in allMisc) {
            if (!this.game.cache.checkBinaryKey(allMisc[misc].getName())) {
                this.game.load.binary(allMisc[misc].getName(), allMisc[misc].getFile());
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
        this.loadTilemapJSON();
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
