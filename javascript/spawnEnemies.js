function spawnEnemies(enemy, enemyContext, speed, WIDTH) {
    "use strict";

    const ENEMIES_COLS = 3;

    const distanceBetweenEnemiesInCol = 200;


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
        let unitPositionRow;
        let takenPositions=[];
        let numberOfEnemiesIncoll = Math.floor(Math.random() * (4 - 2 + 1) + 2)
        for (let j = 0; j < numberOfEnemiesIncoll; j += 1) {

            let randomPosition = Math.floor(Math.random() * (4 - 1 + 1) + 1);
            
            while(takenPositions.indexOf(randomPosition)!==-1){
                randomPosition = Math.floor(Math.random() * (4 - 1 + 1) + 1);
            }
            switch (randomPosition){
                case 1:
                unitPositionRow=100;
                break;
                case 2:
                unitPositionRow=225;
                break;
                case 3:
                unitPositionRow=350;
                break;
                default:
                unitPositionRow=475;
                break;
            }
            takenPositions.push(randomPosition);
            let enemyPlane = createMovableElements({
                coordinates: { x: WIDTH + unitPositionCol, y: unitPositionRow },
                width: enemySprite.width,
                height: enemySprite.height,
                speed: speed
            });

            enemiesMovable.push(enemyPlane);

        }
        unitPositionCol += (enemy.height + distanceBetweenEnemiesInCol);
    }

    return {
        sprite: enemySprite,
        movable: enemiesMovable
    }
}
