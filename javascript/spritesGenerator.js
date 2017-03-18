function createSprite(options) {
    "use strict";

    function render(drawCoordinates, clearCoordinates) {

        this.context.clearRect(
            clearCoordinates.x,
            clearCoordinates.y,
            this.width,
            this.height
        );

        this.context.drawImage(
            this.spritesheet,
            this.frameIndex * this.width,
            0,
            this.width,
            this.height,
            drawCoordinates.x,
            drawCoordinates.y,
            this.width,
            this.height
        );
        return this;
    }

    let sprite = {
        spritesheet: options.spritesheet,
        context: options.context, //drawing context
        width: options.width, //width of a single element
        height: options.height, //height of a single element
        framesNumber: options.framesNumber, //number of frames in sprite sheet
        frameIndex: 0, //start from first frame
        render: render
    };

    return sprite;
}