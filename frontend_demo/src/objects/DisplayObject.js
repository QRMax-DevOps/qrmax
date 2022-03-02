import QRCode from './QRCode';

export default class Display {
    constructor(id, name, media) {
        this.id = id;
        this.name = name;
        this.media = media;
        this.codes = [];
        this.fillArray();
        /*for (let i = 0; i < media; i++) {
            this.codes[i] = new QRCode(i, "code" + i, "Somevalue", 10)
        }
        this.codes = [
            new QRCode(1, 'code1', 'This is for the QR', 10),
            new QRCode(2, 'code2', 'This is for the QR', 10),
            new QRCode(3, 'code3', 'This is for the QR', 10),
            new QRCode(4, 'code4', 'This is for the QR', 10)
        ];*/
        this.codeNum = 0;
    }

    fillArray() {
        for (let i = 0; i < this.media; i++) {
            this.codes[i] = new QRCode(i, "code" + i, "Somevalue", 10)
        }
    }

    allocateCode(QRCode) {
        this.codes.push(QRCode);
        this.codeNum++;
    }


    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getMedia() {
        return this.media;
    }

    toString() {
        return this.id + " " + this.name + " " + this.media + " " + this.codes.length();
    }
}