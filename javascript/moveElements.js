function createMovableElements(options) {
    "use strict";

    function move() {
        //moves only up and down
        let previousPosition = {x: this.coordinates.x, y: this.coordinates.y};
        //clear previous position
        this.coordinates.y = this.direction.y;

        return previousPosition;
    }

    function collide() {
       //TODO: implement collide with other objects (enemies)
    }

    let element = {
        coordinates: options.coordinates,
        direction: options.direction,
        height: options.height,
        width: options.width,
        move: move,
        collide: collide
    };

    return element;
}