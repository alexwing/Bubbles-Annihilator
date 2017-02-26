function levelCreator() {
    //creamos las burbujas
    parent.balls = parent.phaser.game.add.group();
    parent.balls.enableBody = true;
    parent.balls.physicsBodyType = parent.Phaser.Physics.ARCADE;
    
    for (var i = 0; i < parent.nEnemies; i++) {
        if (i % 2 === 0) {
            sprite = parent.phaser.game.add.sprite(parent.phaser.game.world.randomX, parent.phaser.game.world.randomY, 'ball');
        } else {
            sprite = parent.phaser.game.add.sprite(parent.phaser.game.world.randomX, parent.phaser.game.world.randomY, 'ball2');
        }
        sprite.scale.set(parent.phaser.game.rnd.realInRange(0.5, 1));
        sprite.name = "Ball " + i;
        parent.balls.add(sprite);

    }
    // parent.phaser.game.time.events.repeat(parent.Phaser.Timer.SECOND * 3, 10, moveDroid, parent.phaser.game);

    moveBalls();
}

function moveBalls(droidsprite) {
    parent.balls.forEach(function (droidsprite) {
        
        droidsprite.body.velocity.x = parent.phaser.game.rnd.between(-200, 200);
        droidsprite.body.velocity.y = parent.phaser.game.rnd.between(-200, 200);
        droidsprite.body.bounce.x = 1;
        droidsprite.body.bounce.y = 1;
        //droidsprite.body.gravity.y = 0;
        droidsprite.body.collideWorldBounds = true;

    });

}

function deletePreviusLevel() {
    if (parent.balls) {
        parent.balls.forEach(function (entry) {
            entry.destroy();
        });
        parent.balls.removeAll();
        parent.balls.destroy();
    }
}


function evalueLevel() {
    createText("Balls destroyed: " + hits + "/" + parent.nEnemies);
    if (hits >= parent.nEnemies) {
        deletePreviusLevel();
        parent.nEnemies += parent.EnemiesMultiplicator;
        hits = 0;
        levelCreator();
        createText("You WIN!!");
        parent.level++;
        updateLives();
    }
}