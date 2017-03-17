function createMovableElements(options) {
    "use strict";

    function move() {
        //moves only up and down
        let previousPosition = {x: this.coordinates.x, y: this.coordinates.y};
        //clear previous position
        this.coordinates.x -= (this.direction.x + options.speed); //move left

        return previousPosition;
    }

    let element = {
        coordinates: options.coordinates,
        direction: options.direction || {x: 0, y: 0},
        height: options.height,
        width: options.width,
        speed: options.speed,
        move: move
    };

    return element;
}