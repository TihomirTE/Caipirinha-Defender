function createBackground(options) {
    "use strict";

    let backgroundCanvas = document.getElementById('background-canvas');
    let context = backgroundCanvas.getContext('2d');
    let backgroundImage = document.getElementById('background-1');
    let test = 3;
    
    backgroundCanvas.height = options.height;
    backgroundCanvas.width = options.width;

    function render() {
        context.drawImage(
            this.image,
            this.coordinates.x,
            0
        );

        context.drawImage(
            this.image,
            this.image.width - Math.abs(this.coordinates.x),
            0
        );
    }

    function update() {
        this.coordinates.x -= this.speed;

        if (Math.abs(this.coordinates.x) > this.image.width) {
            this.coordinates.x = 0;
        }
    }

    let background = {
        image: backgroundImage,
        speed: options.speed,
        coordinates: {x: 0, y: 0},
        render: render,
        update: update
    };

    return background;
}