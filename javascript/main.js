window.addEventListener('load', function () {
    "use strict";

    const WIDTH = 1024;
    const HEIGHT = 600;

    let playerCanvas = document.getElementById('player-canvas');
    let playerContext = playerCanvas.getContext('2d');

    playerCanvas.width = WIDTH;
    playerCanvas.height = HEIGHT;


    let playerStraight = document.getElementById('plane-spriteStraight');
    let playerLeft = document.getElementById('plane-spriteLeft');
    let playerRight = document.getElementById('plane-spriteRight');


    let planeSprite = createSprite({
        spritesheet: playerStraight,
        context: playerContext,
        width: playerStraight.width,
        height: playerStraight.height,
        framesNumber: 1
    });

    let background = createBackground({
        width: WIDTH,
        height: HEIGHT,
        speed: 10
    });


    let plane = createMovableElements({
        coordinates: {x: 10, y: (HEIGHT / 2) - planeSprite.height}, // start position
        direction: {x: 10, y: (HEIGHT / 2) - planeSprite.height},
        height: planeSprite.height,
        width: planeSprite.width
    });


    window.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                //up
                case 38:
                    if (plane.direction.y > 0) {
                        plane.direction.y -= 20;
                        planeSprite.spritesheet = playerLeft;
                    }
                    break;
                //down
                case 40:
                    if (plane.direction.y < HEIGHT - planeSprite.height) {
                        plane.direction.y += 20;
                        planeSprite.spritesheet = playerRight;
                    }
                    break;
            }
        }
    );

    window.addEventListener('keyup', function (event) {
        if (event.keyCode === 38 || event.keyCode === 40) {
            planeSprite.spritesheet = playerStraight;
            //normalize plane image
        }
    });


    //execute moving operations (rendering)
    function gameLoop() {

        let lastPlaneCoordinates = plane.move();

        planeSprite.render(plane.coordinates, lastPlaneCoordinates);

        background.render();
        background.update();


        window.requestAnimationFrame(gameLoop);
    }

    gameLoop();
});