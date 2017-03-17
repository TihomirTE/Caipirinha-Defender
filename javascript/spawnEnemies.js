function spawnEnemies(enemy, enemyContext, speed, WIDTH) {
    "use strict";

    const ENEMIES_COLS = 5;
    const ENEMIES_ROWS = 7;

    const distanceBetweenEnemiesInRow = 30;
    const distanceBetweenEnemiesInCol = 10;


    let enemiesSprites = [];
    let enemiesMovable = [];

    let unitPositionCol = 0;
    for (let i = 0; i < ENEMIES_COLS; i += 1) {
        let unitPositionRow = 20;
        for (let j = 0; j < ENEMIES_ROWS; j += 1) {

            let enemySprite = createSprite({
                spritesheet: enemy,
                context: enemyContext,
                width: enemy.width,
                height: enemy.height,
                framesNumber: 1
            });

            let enemyPlane = createMovableElements({
                coordinates: {x: WIDTH + unitPositionCol, y: unitPositionRow},
                height: enemySprite.height,
                width: enemySprite.width,
                speed: speed
            });

            enemiesSprites.push(enemySprite);
            enemiesMovable.push(enemyPlane);

            unitPositionRow += (enemy.width + distanceBetweenEnemiesInRow);
        }
        unitPositionCol += (enemy.height + distanceBetweenEnemiesInCol);
    }

    return {
        sprites: enemiesSprites,
        movable: enemiesMovable
    }
}

