export class VideoData {
    constructor(id, fileName, xOffset, yOffset, hAlignment, vAlignment, synchronous) {
        this.id = id;
        this.fileName = fileName;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.hAlignment = hAlignment;
        this.vAlignment = vAlignment;
        this.synchronous = synchronous;
    }
}