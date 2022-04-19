export default class Media{
    constructor(id, name, file, Qr) {
        this.id = id;
        this.name = name;
        this.file = file;
        this.Qr = Qr;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }


    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }


    getFile() {
        return this.file;
    }

    setFile(file) {
        this.file = file;
    }

    getQr() {
        return this.Qr;
    }

    setQR(Qr) {
        this.Qr = Qr;
    }


    toString() {
        return this.id + " " + this.name + " " + this.file;
    }
}