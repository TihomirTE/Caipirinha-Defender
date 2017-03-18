function spawnEnemies(enemy, enemyContext, speed, WIDTH) {
    "use strict";

    const ENEMIES_COLS = 3;
    const ENEMIES_ROWS = 5;

    const distanceBetweenEnemiesInRow = 30;
    const distanceBetweenEnemiesInCol = 10;


    let enemySprite = createSprite({
        spritesheet: enemy,
        context: enemyContext,
        width: enemy.width,
        height: enemy.height,
        framesNumber: 1
    });

    let enemiesMovable = [];

    let unitPositionCol = 0;
    for (let i = 0; i < ENEMIES_COLS; i += 1) {
        let unitPositionRow = 100;
        for (let j = 0; j < ENEMIES_ROWS; j += 1) {


            let enemyPlane = createMovableElements({
                coordinates: {x: WIDTH + unitPositionCol, y: unitPositionRow},
                width: enemySprite.width,
                height: enemySprite.height,
                speed: speed
            });

            enemiesMovable.push(enemyPlane);

            unitPositionRow += (enemy.width + distanceBetweenEnemiesInRow);
        }
        unitPositionCol += (enemy.height + distanceBetweenEnemiesInCol);
    }

    return {
        sprite: enemySprite,
        movable: enemiesMovable
    }
}