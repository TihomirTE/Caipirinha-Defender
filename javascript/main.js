window.addEventListener('load', function () {
    "use strict";

    const WIDTH = 1024;
    const HEIGHT = 600;

    let isMovingForward = true;

    //PLAYER//
    let playerCanvas = document.getElementById('player-canvas');
    let playerContext = playerCanvas.getContext('2d');

    playerCanvas.width = WIDTH;
    playerCanvas.height = HEIGHT;

    let playerStraight = document.getElementById('plane-spriteStraight'),
        playerLeft = document.getElementById('plane-spriteLeft'),
        playerRight = document.getElementById('plane-spriteRight'),
        playerBackward = document.getElementById('plane-spriteBackward'),
        playerLeftBackward = document.getElementById('plane-spriteLeftBackward'),
        playerRigthBackward = document.getElementById('plane-spriteRigthBackward'),
        playerCollision = document.getElementById('plane-collision');

    let planeSprite = createSprite({
        spritesheet: playerStraight,
        context: playerContext,
        width: playerStraight.width,
        height: playerStraight.height,
        framesNumber: 1
    });

    let plane = createMovableElements({
        direction: { x: 10, y: (HEIGHT / 2) - planeSprite.height }, // start position
        height: planeSprite.height,
        width: planeSprite.width,
        speed: 30
    });

    function playerMove(player) {
        //moves all directions
        let previousPosition = { x: player.coordinates.x, y: player.coordinates.y };
        //clear previous position in y coordinates
        player.coordinates.y = player.direction.y;
        //clear previous position in x coordinates
        player.coordinates.x = player.direction.x;

        return previousPosition;
    }

    //ROCKETS//
    let rocketCanvas = document.getElementById('rocket-canvas');
    let rocketContext = playerCanvas.getContext('2d');

    rocketCanvas.width = WIDTH;
    rocketCanvas.height = HEIGHT;

    let rocketImg = document.getElementById('rocket');

    let rocketSprite = createSprite({
        spritesheet: rocketImg,
        context: rocketContext,
        width: rocketImg.width,
        height: rocketImg.height,
        framesNumber: 1
    });

    let rocket = createMovableElements({
        coordinates: { x: plane.direction.x + 10, y: plane.direction.y + 25 }, // start position
        height: rocketSprite.height,
        width: rocketSprite.width,
        speed: 50
    });

    //ENEMY//
    let enemyCanvas = document.getElementById('enemy-canvas');
    let enemyContext = enemyCanvas.getContext('2d');

    enemyCanvas.width = WIDTH;
    enemyCanvas.height = HEIGHT;

    let enemy = document.getElementById('enemy-sprite-1');
    let enemiesArmy = spawnEnemies(enemy, enemyContext, 1, WIDTH); //enemies speed

    //BACKGROUND//
    let background = createBackground({
        width: WIDTH,
        height: HEIGHT,
        speed: 7
    });

    //CANNON//
    let cannonCanvas = document.getElementById('cannon-canvas');
    let cannonContext = cannonCanvas.getContext('2d');

    cannonCanvas.width = WIDTH;
    cannonCanvas.height = HEIGHT;

    let cannonImage = document.getElementById('cannon-sprite-1');
    let cannon = createSprite({
        spritesheet: cannonImage,
        context: cannonContext,
        width: cannonImage.height,
        height: cannonImage.width,
        framesNumber: 1
    });
    //will be removed - used temporarily for marking position//
    let cannonImageTwo = document.getElementById('cannon-sprite-2');
    let cannonImageThree = document.getElementById('cannon-sprite-3');



    let isRocketShoot = false,
        isButtonFree = true,
        isEnemyKilled = false;

    window.addEventListener('keydown', function (event) {
        let pressedButton = event.keyCode;

        // forward
        if (pressedButton === 39) {
            if (plane.direction.x < WIDTH - planeSprite.width) {
                plane.direction.x += plane.speed;
                planeSprite.spritesheet = playerStraight;
            }
            isMovingForward = true;
        }
        // forward left
        if (pressedButton === 38 && isMovingForward) {
            if (plane.direction.y > 0) {
                plane.direction.y -= plane.speed;
                planeSprite.spritesheet = playerLeft;
            }
        }
        // forward rigth
        if (pressedButton === 40) {
            if (plane.direction.y < HEIGHT - planeSprite.height) {
                plane.direction.y += plane.speed;
                planeSprite.spritesheet = playerRight;
            }
        }

        // backward
        if (pressedButton === 37) {
            if (plane.direction.x > 0) {
                plane.direction.x -= plane.speed;
                planeSprite.spritesheet = playerBackward;
            }
            isMovingForward = false;
        }
        // backward left
        if (pressedButton === 40 && !isMovingForward) {
            if (plane.direction.y < HEIGHT - planeSprite.height) {
                plane.direction.y += plane.speed;
                planeSprite.spritesheet = playerLeftBackward;
            }
        }
        // backward right
        if (pressedButton === 38 && !isMovingForward) {
            if (plane.direction.y > 0) {
                plane.direction.y -= plane.speed;
                planeSprite.spritesheet = playerRigthBackward;
            }
        }

        //shoot
        if (pressedButton === 32) {
            if (isButtonFree) {
                isRocketShoot = true;
                rocket.coordinates.x = plane.direction.x + 60;
                rocket.coordinates.y = plane.direction.y + 25;
            }
        }
    });

    window.addEventListener('keyup', function (event) {
        let upButton = event.keyCode;

        //normalize plane position image
        if (upButton === 38 || upButton === 40) {
            if (isMovingForward) {
                planeSprite.spritesheet = playerStraight;
            } else {
                planeSprite.spritesheet = playerBackward;
            }
        }
    });


    let rocketsDepot = [];

    //execute moving operations (rendering)
    function gameLoop() {
        //PLAYER//
        let lastPlaneCoordinates = playerMove(plane);
        planeSprite.render(plane.coordinates, lastPlaneCoordinates);

        //CANNON
        //will be removed - used temporarily for marking position//
        cannonContext.drawImage(cannonImage, 900, 520);
        cannonContext.drawImage(cannonImageTwo, 600, 520);
        cannonContext.drawImage(cannonImageThree, 300, 520);
        //ROCKETS//
        if (isRocketShoot) {
            let lastRocketCoordinates;
            if (isMovingForward) {
                // shooting forward
                lastRocketCoordinates = rocket.move('right');
            } else {
                // shooting backward
                lastRocketCoordinates = rocket.move('left');
            }

            rocketSprite.render(rocket.coordinates, lastRocketCoordinates);
            rocketsDepot.push(rocket);
            if (rocket.coordinates.x < WIDTH - enemy.width) {
                isButtonFree = false;
            } else {
                isButtonFree = true;
            }
        } else {
            if ((rocket.coordinates.x > WIDTH - enemy.width) || isEnemyKilled) {
                isButtonFree = true;
                isEnemyKilled = false; //prevent dirty rectangle
            }
        }

        //ENEMY//
        for (let i = 0; i < enemiesArmy.movable.length; i += 1) {
            let enemyUnit = enemiesArmy.movable[i];
            let lastEnemyCoordinates = enemyUnit.move('left');
            enemiesArmy.sprite.render(enemyUnit.coordinates, lastEnemyCoordinates);

            //collide (game over)
            if (collidesWith(plane, enemyUnit) || (enemyUnit.coordinates.x < 0)) {
                playerContext.drawImage(document.getElementById('plane-collision'),
                    plane.coordinates.x, plane.coordinates.y);

                setTimeout(function () {
                    playerContext.drawImage(document.getElementById('game-over'), 0, 0);
                }, 1500);

                return;
            }

            if (isRocketShoot) {
                for (let j = 0; j < rocketsDepot.length; j += 1) {
                    let rocketUnit = rocketsDepot[j];

                    //shoot (kill enemy)
                    if (rocketUnit.coordinates.x >= (enemyUnit.coordinates.x - enemyUnit.width / 2) &&
                        rocketUnit.coordinates.x <= (enemyUnit.coordinates.x + enemyUnit.width / 2) &&
                        rocketUnit.coordinates.y >= (enemyUnit.coordinates.y - enemyUnit.height / 2) &&
                        rocketUnit.coordinates.y <= (enemyUnit.coordinates.y + enemyUnit.height / 2)) {

                        enemiesArmy.movable.splice(i, 1); //delete enemy from the army

                        rocketContext.clearRect(rocketUnit.coordinates.x, rocketUnit.coordinates.y,
                            rocketUnit.width, rocketUnit.height); //clear rocket

                        enemyContext.clearRect(enemyUnit.coordinates.x, enemyUnit.coordinates.y,
                            enemyUnit.width, enemyUnit.height); //clear enemy

                        rocketsDepot.length = 0; //clear rocket depot
                        isRocketShoot = false;
                        isEnemyKilled = true;
                        break;
                    }
                }
            }
        }

        //game winning
        if (enemiesArmy.movable.length === 0) {
            playerContext.drawImage(document.getElementById('game-win'), 0, 0);
            return;
        }

        //BACKGROUND//
        background.render();
        background.update();
        window.requestAnimationFrame(gameLoop);
    }

    function collidesWith(plane, enemyUnit) {

        let minDistanceX = plane.width / 2 + enemyUnit.width / 2,
            minDistanceY = plane.height / 2 + enemyUnit.height / 2,

            actualDistanceX = Math.abs(plane.coordinates.x - enemyUnit.coordinates.x),
            actualDistanceY = Math.abs(plane.coordinates.y - enemyUnit.coordinates.y);

        return ((minDistanceX >= actualDistanceX) && (minDistanceY >= actualDistanceY));
    }

    gameLoop();
});