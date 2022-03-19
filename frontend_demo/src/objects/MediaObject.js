export default class Media{
    constructor(id, name, file) {
        this.id = id;
        this.name = name;
        this.file = file;
        
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

    setName(id) {
        this.id = id;
    }


    getFile() {
        return this.file;
    }

    setFile(file) {
        this.file = file;
    }

    getLength() {
        return this.length;
    }

    setLength(length){
        this.length = length;
    }

    toString() {
        return this.id + " " + this.name + " " + this.file;
    }
}