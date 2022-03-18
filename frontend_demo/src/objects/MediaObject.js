export default class Media{
    constructor(name, content, length) {
        this.name = name;
        this.content = content;
        this.length = length;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getContent() {
        return this.content;
    }

    setContent(content) {
        this.content = content;
    }

    getLength() {
        return this.length;
    }

    setLength(length){
        this.length = length;
    }

    toString() {
        return this.name + " " + this.content + " " + this.length;
    }
}