import Media from "./MediaObject.js";

export default class QRCode {
    constructor(codeIndex, code, media) {
  
        this.code = code;
        this.media = media;
        this.codeIndex = codeIndex;
        this.fillMedia();
    }

    fillMedia() {
        this.media = new Media("Media 1", "c:/media", 0)
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
    }

    getIndex() {
        return this.codeIndex;
    }

    setIndex(codeIndex) {
        this.codeIndex = codeIndex;
    }

    getMedia() {
        return this.media;
    }

    setMedia(media) {
        this.media = media;
    }
}