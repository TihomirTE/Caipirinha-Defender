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
            direction: {x: 10, y: (HEIGHT / 2) - planeSprite.height}, // start position
            height: planeSprite.height,
            width: planeSprite.width,
            speed: 30
        });

        function playerMove(player) {
            //moves only left and right
            let previousPosition = {x: player.coordinates.x, y: player.coordinates.y};
            //clear previous position
            player.coordinates.y = player.direction.y;

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
            coordinates: {x: plane.direction.x + 10, y: plane.direction.y + 25}, // start position
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
        });

        let isRocketShoot = false;
        window.addEventListener('keyup', function (event) {
            if (event.keyCode === 38 || event.keyCode === 40) {
                planeSprite.spritesheet = playerStraight;
                //normalize plane position image
            }
            if (event.keyCode === 32) {
                //shoot
                isRocketShoot = true;
                rocket.coordinates.x = plane.direction.x + 60;
                rocket.coordinates.y = plane.direction.y + 25;
            }
        });

        let rocketsDepot = [];

        //execute moving operations (rendering)
        function gameLoop() {
            //PLAYER//
            let lastPlaneCoordinates = playerMove(plane);
            planeSprite.render(plane.coordinates, lastPlaneCoordinates);

            //ROCKETS//
            if (isRocketShoot) {
                let lastRocketCoordinates = rocket.move('right');
                rocketSprite.render(rocket.coordinates, lastRocketCoordinates);
                rocketsDepot.push(rocket);
            }

            //ENEMY//
            for (let i = 0; i < enemiesArmy.movable.length; i += 1) {
                let enemyUnit = enemiesArmy.movable[i];
                let lastEnemyCoordinates = enemyUnit.move('left');
                enemiesArmy.sprite.render(enemyUnit.coordinates, lastEnemyCoordinates);

                //collide (game over)
                if (plane.direction.x >= (enemyUnit.coordinates.x - (plane.width / 2))) {
                    playerContext.drawImage(document.getElementById('game-over'), 0, 0);
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
        gameLoop();
    }
);