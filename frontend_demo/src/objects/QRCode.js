export default class QRCode {
    constructor(codeIndex, title, code, length) {
        this.title = title;
        this.code = code;
        this.length = length;
        this.codeIndex = codeIndex;
    }

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
    }

    getLength() {
        return this.length;
    }

    setLength(length) {
        this.length = length;
    }

    getIndex() {
        return this.codeIndex;
    }

    setIndex(codeIndex) {
        this.codeIndex = codeIndex;
    }
}