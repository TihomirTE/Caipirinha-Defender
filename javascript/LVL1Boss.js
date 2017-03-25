function spawnLevelOneBoss(boss, bossContext, speed, WIDTH) {
    "use strict"

    //almost a pure copy of spawn enemies but has less things in it 

    let bossSprite = createSprite({
        spritesheet: boss,
        context: bossContext,
        width: boss.width,
        height: boss.height,
        framesNumber: 1
    });

    let unitPositionCol = 0;
    let bossMovable = [];
    let unitPositionRow;
    let takenPositions = [];
    for (let j = 0; j < 3; j += 1) {
        switch (j) {
            case 0:
                unitPositionRow = 100;
                break;
            case 1:
                unitPositionRow = 300;
                break;
            default:
                unitPositionRow = 500;
                break;
        }
        let bossPlane = createMovableElements({
            coordinates: { x: WIDTH + unitPositionCol, y: unitPositionRow },
            width: bossSprite.width,
            height: bossSprite.height,
            speed: speed,
            health: 7                                                               //this is the health of boss
        });

        bossMovable.push(bossPlane);

    }

    return {
        sprite: bossSprite,
        movable: bossMovable,
    }
}