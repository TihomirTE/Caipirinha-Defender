window.addEventListener('load', function () {
    "use strict";

    const WIDTH = 1024;
    const HEIGHT = 600;

    //PLAYER//
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

    let plane = createMovableElements({
        coordinates: {x: 0, y: 0},
        direction: {x: 10, y: (HEIGHT / 2) - planeSprite.height}, // start position
        height: planeSprite.height,
        width: planeSprite.width,
        speed: 20
    });

    function playerMove(player) {
        //moves only left and right
        let previousPosition = {x: player.coordinates.x, y: player.coordinates.y};
        //clear previous position
        player.coordinates.y = player.direction.y;

        return previousPosition;
    }

    //ENEMY//
    let enemyCanvas = document.getElementById('enemy-canvas');
    let enemyContext = enemyCanvas.getContext('2d');

    enemyCanvas.width = WIDTH;
    enemyCanvas.height = HEIGHT;

    let enemy = document.getElementById('enemy-sprite-1');
    let enemiesArmy = spawnEnemies(enemy, enemyContext, 2, WIDTH);

    //BACKGROUND//
    let background = createBackground({
        width: WIDTH,
        height: HEIGHT,
        speed: 10
    });


    window.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                //up
                case 38:
                    if (plane.direction.y > 0) {
                        plane.direction.y -= plane.speed;
                        planeSprite.spritesheet = playerLeft;
                    }
                    break;
                //down
                case 40:
                    if (plane.direction.y < HEIGHT - planeSprite.height) {
                        plane.direction.y += plane.speed;
                        planeSprite.spritesheet = playerRight;
                    }
                    break;
            }
        }
    );

    window.addEventListener('keyup', function (event) {
        if (event.keyCode === 38 || event.keyCode === 40) {
            planeSprite.spritesheet = playerStraight;
            //normalize plane position image
        }
    });

    //execute moving operations (rendering)
    function gameLoop() {
        //PLAYER//
        let lastPlaneCoordinates = playerMove(plane);
        planeSprite.render(plane.coordinates, lastPlaneCoordinates);

        //ENEMY//        
        for (let i = 0; i < enemiesArmy.movable.length; i += 1) {
            let enemy = enemiesArmy.movable[i];
            let lastEnemyCoordinates = enemy.move();
            enemiesArmy.sprites[i].render(enemy.coordinates, lastEnemyCoordinates);

            //collide (game over)
            if (plane.direction.x >= (enemy.coordinates.x - (plane.width / 2))) {
                playerContext.drawImage(document.getElementById('game-over'), 0, 0);
                return;
            }
        }

        //BACKGROUND//
        background.render();
        background.update();
        window.requestAnimationFrame(gameLoop);
    }

    gameLoop();
});