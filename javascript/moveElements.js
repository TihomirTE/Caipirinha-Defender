function createMovableElements(options) {
    "use strict";

    function move(direction) {
        //moves only up and down
        let previousPosition = { x: this.coordinates.x, y: this.coordinates.y };
        //clear previous position
        if (direction === 'left') {
            this.coordinates.x -= (this.direction.x + options.speed);
        } else if (direction === 'right') {
            this.coordinates.x += (this.direction.x + options.speed);
        }
        return previousPosition;
    }

    let element = {
        coordinates: options.coordinates || { x: 0, y: 0 },
        direction: options.direction || { x: 0, y: 0 },
        height: options.height,
        width: options.width,
        speed: options.speed,
        move: move
    };

    return element;
}