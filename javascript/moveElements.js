function createMovableElements(options) {
    "use strict";

    function move(direction, placeToStop = -1) {    // aded a default place to stop if u want ur objexts to stop while moving at a certain place 
        //moves only up and down
        let previousPosition = { x: this.coordinates.x, y: this.coordinates.y };
        //clear previous position
        if (direction === 'left' && this.coordinates.x >= placeToStop) {
            this.coordinates.x -= (this.direction.x + options.speed);
        } else if (direction === 'right' && this.coordinates.x >= placeToStop) {
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
        move: move,
        health: options.health                                             //this is the health of a movable object if u need to use it 
    };

    return element;
}