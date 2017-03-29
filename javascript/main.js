//esversion: 6

function startGame() {
    "use strict";

    const WIDTH = 1024;
    const HEIGHT = 600;

    //SVG to Canvas Pixel Conversion and vice versa
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var convertToWindowHeightFactor = windowHeight / HEIGHT;
    var convertToWindowWidthFactor = windowWidth / WIDTH;
    var convertToCanvasHeightFactor = HEIGHT / windowHeight;
    var convertToCanvasWidthFactor = WIDTH / windowWidth;

    let scoreCounter = 0;
    let nickname = '';

    let playerData = {
        nickname: nickname,
        score: scoreCounter
    };

    let highScores = [];


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
            yDown: options.yDown

        }
    }

    let button = createButton({ xLeft: 0, yUp: 0 });
    button.xRight = window.innerWidth;
    button.yDown = window.innerHeight;

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
        if (button.xLeft <= mouseX && mouseX <= button.xRight &&
            button.yUp <= mouseY && mouseY <= button.yDown) {
            return true;
        }
        return false;
    }

    function mouseClicked(event) {
        mouseX = event.pageX - menuCanvas.offsetLeft;
        mouseY = event.pageY - menuCanvas.offsetTop;
        if (checkClicked(button)) {
            startGameLoop();
            document.removeEventListener('click', mouseClicked);
        }
    }

    document.addEventListener('click', mouseClicked);

    function startGameLoop() {
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

        let rocketImgForward = document.getElementById('rocketForward');
        let rocketImgBackward = document.getElementById('rocketBackward');


        let rocketSprite = createSprite({
            spritesheet: rocketImgForward,
            context: rocketContext,
            width: rocketImgForward.width,
            height: rocketImgForward.height,
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
            window.setInterval(function () {
                isRocketShoot = true;
                rocket.coordinates.x = plane.direction.x + 60;
                rocket.coordinates.y = plane.direction.y + 25;
            },
                //time between shots
                1000);
            startShoting = false;
        }

        //ENEMY//
        let enemyCanvas = document.getElementById('enemy-canvas');
        let enemyContext = enemyCanvas.getContext('2d');

        enemyCanvas.width = WIDTH;
        enemyCanvas.height = HEIGHT;

        let enemy = document.getElementById('enemy-sprite-1');
        let enemiesSpeed = 1;
        let enemiesArmy = spawnEnemies(enemy, enemyContext, enemiesSpeed, WIDTH); //enemies speed


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

        //CANNON-BALLS//
        var svg = document.getElementById("cannon-balls-svg");
        var svgCannonBall = document.createElementNS("http://www.w3.org/2000/svg", "circle");


        //Positions of Cannons
        // cannonContext.drawImage(cannonImage, 900, 520);
        // cannonContext.drawImage(cannonImageTwo, 600, 520);
        // cannonContext.drawImage(cannonImageThree, 300, 520);
        var ballX = (convertToWindowWidthFactor * 600) + 10; // Ball x position.
        var ballY = (convertToWindowHeightFactor * 520) + 10; // Ball y position.
        //debugger collision ballX = 30, ballY = 180
        var ballR = 5;
        var ballColor = "orange";
        //relates to speed and angle
        // -> speed higher DX and DY is higher speed
        // -> different ratio denotes the angle
        var ballDX = -0.5; // Change in ball x position.
        var ballDY = -0.5; // Change in ball y position.

        svgCannonBall.setAttribute("cx", ballX);
        svgCannonBall.setAttribute("cy", ballY);
        svgCannonBall.setAttribute("r", ballR);
        svgCannonBall.setAttribute("fill", ballColor);
        // svgCannonBall.setAttribute("id", "ball");
        svg.appendChild(svgCannonBall);

        var svgElement = {
            DOM: svgCannonBall,
            width: 2 * ballR,
            height: 2 * ballR,
            coordinatesWindow: {
                x: parseInt(svgCannonBall.getAttribute("cx")),
                y: parseInt(svgCannonBall.getAttribute("cy")),
            },
            coordinates: {
                x: parseInt(svgCannonBall.getAttribute("cx")) * convertToCanvasWidthFactor,
                y: parseInt(svgCannonBall.getAttribute("cy")) * convertToCanvasHeightFactor
            }
        };


        let ballCanvas = document.getElementById('ball-canvas');
        let ballContext = cannonCanvas.getContext('2d');

        ballCanvas.width = WIDTH;
        ballCanvas.height = HEIGHT;

        let ballImg = document.getElementById('enemy-fire');

        let ballSprite = createSprite({
            spritesheet: ballImg,
            context: ballContext,
            width: ballImg.width,
            height: ballImg.height,
            framesNumber: 1
        });

        let ball = createMovableElements({
            coordinates: { x: cannon.x + -10, y: cannon.y + -25 }, // start position
            height: ballSprite.height,
            width: ballSprite.width,
            speed: 60
        });


        let cannonShoting = true;
        let isBallShoot = false;
        //autoshoot
        if (startShoting) {
            window.setInterval(function () {
                isBallShoot = true;
                ball.coordinates.x = cannon.x + 60;
                ball.coordinates.y = cannon.y + 25;
            },
                //time between shots
                300);
            startShoting = false;
        }


        let ballsDepot = [];

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

        window.addEventListener('keydown', function (event) {
            let pressedButton = event.keyCode;

            // forward
            if (pressedButton === 39) {
                if (plane.direction.x < WIDTH / 2 - planeSprite.width) {
                    plane.direction.x += plane.speed;
                    planeSprite.spritesheet = playerStraight;
                    rocketSprite.spritesheet = rocketImgForward;
                }
                isMovingForward = true;
            }
            // forward left
            if (pressedButton === 38 && isMovingForward) {
                if (plane.direction.y > 0) {
                    plane.direction.y -= plane.speed;
                    planeSprite.spritesheet = playerLeft;
                    rocketSprite.spritesheet = rocketImgForward;
                }
            }
            // forward rigth
            if (pressedButton === 40) {
                if (plane.direction.y < HEIGHT - planeSprite.height) {
                    plane.direction.y += plane.speed;
                    planeSprite.spritesheet = playerRight;
                    rocketSprite.spritesheet = rocketImgForward;
                }
            }

            // backward
            if (pressedButton === 37) {
                if (plane.direction.x > 0) {
                    plane.direction.x -= plane.speed;
                    planeSprite.spritesheet = playerBackward;
                    rocketSprite.spritesheet = rocketImgBackward;
                }
                isMovingForward = false;
            }
            // backward left
            if (pressedButton === 40 && !isMovingForward) {
                if (plane.direction.y < HEIGHT - planeSprite.height) {
                    plane.direction.y += plane.speed;
                    planeSprite.spritesheet = playerLeftBackward;
                    rocketSprite.spritesheet = rocketImgBackward;
                }
            }
            // backward rigth
            if (pressedButton === 38 && !isMovingForward) {
                if (plane.direction.y > 0) {
                    plane.direction.y -= plane.speed;
                    planeSprite.spritesheet = playerRigthBackward;
                    rocketSprite.spritesheet = rocketImgBackward;
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

        let levelNumber = 1;
        let rocketsDepot = [];

        //execute moving operations (rendering)
        function gameLoop() {

            //BACKGROUND//
            background.render();
            background.update();

            //PLAYER//
            let lastPlaneCoordinates = playerMove(plane);
            planeSprite.render(plane.coordinates, lastPlaneCoordinates);

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

            //ENEMY - CANNONBALLS
            //CANNONS
            cannonContext.drawImage(cannonImage, 900, 520);
            cannonContext.drawImage(cannonImageTwo, 600, 520);
            cannonContext.drawImage(cannonImageThree, 300, 520);
            //Updating cannoball position

            //updating DOM Position
            svgElement.coordinatesWindow.x += ballDX;
            svgElement.coordinatesWindow.y += ballDY;
            svgElement.DOM.setAttribute("cx", svgElement.coordinatesWindow.x);
            svgElement.DOM.setAttribute("cy", svgElement.coordinatesWindow.y);
            //updating canvas internal position
            svgElement.coordinates.x += ballDX * convertToCanvasWidthFactor;
            svgElement.coordinates.y += ballDY * convertToCanvasHeightFactor;



            var collisionWithBall = collidesWithCannon(plane, svgElement);
            if (collisionWithBall) {
                gameOver();
                return;
            }

            //ENEMY - ARMY
            for (let i = 0; i < enemiesArmy.movable.length; i += 1) {
                let enemyUnit = enemiesArmy.movable[i];
                let lastEnemyCoordinates = enemyUnit.move('left');
                enemiesArmy.sprite.render(enemyUnit.coordinates, lastEnemyCoordinates);

                //collide (game over)
                if (collidesWith(plane, enemyUnit) || (enemyUnit.coordinates.x < 0)) {

                    gameOver();

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

                            let blastSound = document.getElementById('blast');
                            blastSound.playbackRate = 3;
                            blastSound.play();
                            enemiesArmy.movable.splice(i, 1); //delete enemy from the army
                            scoreCounter += 1;

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
                    bossArmy.sprite.render(bossUnit.coordinates, lastEnemyCoordinates);


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

                                let blastSound = document.getElementById('blast');
                                blastSound.playbackRate = 3;
                                blastSound.play();
                                bossUnit.health -= 1;

                                if (bossUnit.health < 1) {

                                    bossArmy.movable.splice(i, 1); //delete enemy from the army
                                    scoreCounter += 5;

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
            if (bossArmy.movable.length === 0 && enemiesArmy.movable.length === 0) {
                if (levelNumber === 5) {
                    //END GAME
                    playerContext.drawImage(document.getElementById('game-win'), 0, 0);

                    var input = new CanvasInput({
                        canvas: document.getElementById('player-canvas'),
                        fontSize: 18,
                        fontFamily: 'Arial',
                        fontColor: '#212121',
                        fontWeight: 'bold',
                        width: 200,
                        padding: 8,
                        borderWidth: 1,
                        borderColor: '#000',
                        borderRadius: 3,
                        boxShadow: '1px 1px 0px #fff',
                        innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
                        placeHolder: 'Enter nickname : '
                    });

                    window.addEventListener('keydown', function (event) {

                        let pressedButton = event.keyCode;
                        if (pressedButton === 13) {
                            playerData.nickname = input.value();
                            playerData.score = scoreCounter;

                            highScores.push(playerData);

                            playerContext.fillStyle = 'white';
                            playerContext.strokeStyle = 'white';
                            playerContext.font = '32pt Times New Roman serif';
                            playerContext.fillText(`Nickname : ${highScores[0].nickname}`, 10, 100);
                            playerContext.fillText(`Score : ${highScores[0].score}`.trim(), 10, 150);
                            playerContext.strokeText('Hit F5 to play again!', 500, 50);

                        }
                    });
                    return;
                } else {
                    levelNumber += 1;
                    enemiesSpeed += 0.1;
                    rocket.speed += 0.5;
                    plane.speed += 2;

                    enemy = document.getElementById(`enemy-sprite-${levelNumber}`);
                    background.image = document.getElementById(`background-${levelNumber}`);
                    enemiesArmy = spawnEnemies(enemy, enemyContext, enemiesSpeed, WIDTH);
                }
            }

            window.requestAnimationFrame(gameLoop);
        }

        window.addEventListener('keydown', function (event) {
            let pressedButton = event.keyCode;

            if (pressedButton === 32) {
                alert(`Game Paused!
                Hit space to resume`);
            }
        });

        function gameOver() {
            document.getElementById('explosion').play();
            playerContext.drawImage(document.getElementById('plane-collision'),
                plane.coordinates.x, plane.coordinates.y);

            setTimeout(function () {
                playerContext.drawImage(document.getElementById('game-over'), 0, 0);

                var input = new CanvasInput({
                    canvas: document.getElementById('player-canvas'),
                    fontSize: 18,
                    fontFamily: 'Arial',
                    fontColor: '#212121',
                    fontWeight: 'bold',
                    width: 200,
                    padding: 8,
                    borderWidth: 1,
                    borderColor: '#000',
                    borderRadius: 3,
                    boxShadow: '1px 1px 0px #fff',
                    innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
                    placeHolder: 'Enter nickname : '
                });

                window.addEventListener('keydown', function (event) {

                    let pressedButton = event.keyCode;
                    if (pressedButton === 13) {
                        playerData.nickname = input.value();
                        playerData.score = scoreCounter;

                        highScores.push(playerData);

                        playerContext.fillStyle = 'white';
                        playerContext.font = '32pt Times New Roman serif';
                        playerContext.fillText(`Nickname : ${highScores[0].nickname}`, 10, 100);
                        playerContext.fillText(`Score : ${highScores[0].score}`.trim(), 10, 150);
                        playerContext.strokeText('Hit F5 to play again!', 500, 50);

                    }
                });
            }, 1000);
        }

        function collidesWith(plane, enemyUnit) {
            // debugger;
            let minDistanceX = plane.width / 2 + enemyUnit.width / 2,
                minDistanceY = plane.height / 2 + enemyUnit.height / 2,

                actualDistanceX = Math.abs(plane.coordinates.x - enemyUnit.coordinates.x),
                actualDistanceY = Math.abs(plane.coordinates.y - enemyUnit.coordinates.y);

            return ((minDistanceX >= actualDistanceX) && (minDistanceY >= actualDistanceY));
        }

        function collidesWithCannon(plane, cannonBall) {
            //precision

            let minDistanceX = 100,
                minDistanceY = 100,
                planeWindowCoordinatesX = plane.coordinates.x * convertToWindowWidthFactor,
                planeWindowCoordinatesY = plane.coordinates.y * convertToWindowWidthFactor,

                actualDistanceX = Math.abs(planeWindowCoordinatesX - cannonBall.coordinatesWindow.x),
                actualDistanceY = Math.abs(planeWindowCoordinatesY - cannonBall.coordinatesWindow.y);

            return ((minDistanceX >= actualDistanceX) && (minDistanceY >= actualDistanceY));
        }


        gameLoop();
    }
}