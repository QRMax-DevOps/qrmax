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

    setId(id) {
        this.id = id;
    }


    getFile() {
        return this.file;
    }

    setFile(file) {
        this.file = file;
    }

    toString() {
        return this.id + " " + this.name + " " + this.file;
    }
}