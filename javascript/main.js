function startGame(){
    "use strict";

    const WIDTH = 1024;
    const HEIGHT = 600;


    //MENU//
    let menuCanvas = document.getElementById("menu-canvas");
    let menuContext = menuCanvas.getContext("2d");

    let menuBackground = createBackground({
        speed: 1
    });
    menuBackground.image = document.getElementById('menu-background');
    let playImage = document.getElementById('play-image');
    let instructionsImage = document.getElementById('instructions-image');

    let menuBackgroundY = 0;

    function createButton(options) {
        return {
            xLeft: options.xLeft,
            xRight: options.xRight,
            yUp: options.yUp,
            yDown: options.yDown,

        }
    };

    let button = createButton({ xLeft: 560, yUp: 270 });
    button.xRight = button.xLeft + playImage.width;
    button.yDown = button.yUp + playImage.height;

    let frames = 30;
    let timerId = 0;

    timerId = setInterval(menuUpdate, 1000 / frames);

    function drawMenu() {
        menuContext.drawImage(menuBackground.image, 0, menuBackgroundY);
        menuContext.drawImage(playImage, 440, 240);
        menuContext.drawImage(instructionsImage, 460, 295);
    }

    function menuUpdate() {
        clearMenu();
        moveMenu();
        drawMenu();
    }

    function clearMenu() {
        menuContext.clearRect(0, 0, WIDTH, HEIGHT);
    }

    function moveMenu() {
        menuBackgroundY -= menuBackground.speed;
        if (menuBackgroundY === -1 * HEIGHT) {
            menuBackgroundY = 0;
        }
    }

    let mouseX, mouseY;

    function checkClicked(button) {
        if (button.xLeft <= mouseX && mouseX <= button.xRight && button.yUp <= mouseY && mouseY <= button.yDown) {
            return true;
        }
        return false;
    }

    function mouseClicked(event) {
        mouseX = event.pageX - menuCanvas.offsetLeft;
        mouseY = event.pageY - menuCanvas.offsetTop;
        if (checkClicked(button)) {
            startGame();
            document.removeEventListener('click', mouseClicked);
        }
    }

    document.addEventListener('click', mouseClicked);

    function startGame() {
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
            speed: 60
        });


        let startShoting = true;
        let isRocketShoot = false;
        //autoshoot
        if (startShoting) {
            window.setInterval(function() {
                    isRocketShoot = true;
                    rocket.coordinates.x = plane.direction.x + 60;
                    rocket.coordinates.y = plane.direction.y + 25;
                },
                //time between shots
                440);
            startShoting = false;
        }


        let rocketsDepot = [];

        //ENEMY//
        let enemyCanvas = document.getElementById('enemy-canvas');
        let enemyContext = enemyCanvas.getContext('2d');

        enemyCanvas.width = WIDTH;
        enemyCanvas.height = HEIGHT;

        let enemy = document.getElementById('enemy-sprite-1');
        let enemiesArmy = spawnEnemies(enemy, enemyContext, 1.5, WIDTH); //enemies speed


        //LVL1BOSS

        let bossCanvas = document.getElementById('enemy-canvas');
        let bossContext = bossCanvas.getContext('2d');

        bossCanvas.width = WIDTH;
        bossCanvas.height = HEIGHT;

        let boss = document.getElementById('enemy-sprite-3');
        let bossArmy = spawnLevelOneBoss(boss, bossContext, 0.8, WIDTH);


        //BOSSSHOTS
        let cannonballCanvas = document.getElementById('ball-canvas');
        let cannonballContext = playerCanvas.getContext('2d');

        cannonballCanvas.width = WIDTH;
        cannonballCanvas.height = HEIGHT;

        let cannonballImg = document.getElementById('enemy-fire');

        let cannonballSprite = createSprite({
            spritesheet: cannonballImg,
            context: cannonballContext,
            width: cannonballImg.width,
            height: cannonballImg.height,
            framesNumber: 1
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

        //BACKGROUND//

        let background = createBackground({
            width: WIDTH,
            height: HEIGHT,
            speed: 7
        });


        let isButtonFree = true,
            isEnemyKilled = false;

        window.addEventListener('keydown', function(event) {
            let pressedButton = event.keyCode;

            // forward
            if (pressedButton === 39) {
                if (plane.direction.x < WIDTH / 2 - planeSprite.width) {
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
            // backward rigth
            if (pressedButton === 38 && !isMovingForward) {
                if (plane.direction.y > 0) {
                    plane.direction.y -= plane.speed;
                    planeSprite.spritesheet = playerRigthBackward;
                }
            }

        });

        window.addEventListener('keyup', function(event) {
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

                    setTimeout(function() {
                        playerContext.drawImage(document.getElementById('game-over'), 0, 0);
                    }, 1000);

                    return;
                }
                if (isRocketShoot) {
                    for (let j = 0; j < rocketsDepot.length; j += 1) {
                        let rocketUnit = rocketsDepot[j];
                        //if rocket is out of bounds delete it
                        if (rocketUnit.coordinates.x >= (WIDTH - 40) || rocketUnit.coordinates.x <= 25) {
                            rocketContext.clearRect(rocketUnit.coordinates.x, rocketUnit.coordinates.y,
                                rocketUnit.width, rocketUnit.height); //clear rocket if out of range
                            rocketsDepot.length = 0;
                            isRocketShoot = false;
                        }

                        //shoot (kill enemy)
                        if (rocketUnit.coordinates.x >= (enemyUnit.coordinates.x - enemyUnit.width / 1.4) &&
                            rocketUnit.coordinates.x <= (enemyUnit.coordinates.x + enemyUnit.width / 1.4) &&
                            rocketUnit.coordinates.y >= (enemyUnit.coordinates.y - enemyUnit.height / 1.4) &&
                            rocketUnit.coordinates.y <= (enemyUnit.coordinates.y + enemyUnit.height / 1.4)) {

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



            //Boss lvl 1
            if (enemiesArmy.movable.length === 0) {


                for (let i = 0; i < bossArmy.movable.length; i += 1) {
                    let bossUnit = bossArmy.movable[i];
                    let lastEnemyCoordinates;
                    lastEnemyCoordinates = bossUnit.move('left', (WIDTH - (WIDTH / 3))); //moves in about 1/3 in and stops 
                    bossArmy.sprite.render(bossUnit.coordinates, lastEnemyCoordinates)


                    if (isRocketShoot) {
                        for (let j = 0; j < rocketsDepot.length; j += 1) {
                            let rocketUnit = rocketsDepot[j];
                            //if rocket is out of bounds delete it
                            if (rocketUnit.coordinates.x >= (WIDTH - 40) || rocketUnit.coordinates.x <= 25) {
                                rocketContext.clearRect(rocketUnit.coordinates.x, rocketUnit.coordinates.y,
                                    rocketUnit.width, rocketUnit.height); //clear rocket if out of range
                                rocketsDepot.length = 0;
                                isRocketShoot = false;
                            }

                            //shoot (kill enemy)
                            if (rocketUnit.coordinates.x >= (bossUnit.coordinates.x - bossUnit.width / 1.4) &&
                                rocketUnit.coordinates.x <= (bossUnit.coordinates.x + bossUnit.width / 1.4) &&
                                rocketUnit.coordinates.y >= (bossUnit.coordinates.y - bossUnit.height / 1.4) &&
                                rocketUnit.coordinates.y <= (bossUnit.coordinates.y + bossUnit.height / 1.4)) {
                                bossUnit.health -= 1;
                                if (bossUnit.health < 1) {
                                    bossArmy.movable.splice(i, 1); //delete enemy from the army

                                    bossContext.clearRect(bossUnit.coordinates.x, bossUnit.coordinates.y,
                                        bossUnit.width, bossUnit.height); //clear enemy
                                }
                                rocketContext.clearRect(rocketUnit.coordinates.x, rocketUnit.coordinates.y,
                                    rocketUnit.width, rocketUnit.height); //clear rocket



                                rocketsDepot.length = 0; //clear rocket depot
                                isRocketShoot = false;
                                isEnemyKilled = true;
                                break;
                            }
                        }
                    }
                }
            }


            //game winning
            if (bossArmy.movable.length === 0) {
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
    }
}