import Media from "./MediaObject.js";

export default class QRCode {
    constructor(codeIndex, code) {
  
        this.code = code;
        this.media = media;
        this.codeIndex = codeIndex;
        this.fillMedia();
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
}