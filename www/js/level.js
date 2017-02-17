function levelCreator() {
   /* if (parent.balls) {
        parent.balls.removeAll();
        parent.balls.destroy();
    }*/
    //creamos las burbujas
    parent.balls = parent.phaser.game.add.group();
    parent.balls.enableBody = true;
    parent.balls.physicsBodyType = parent.Phaser.Physics.ARCADE;

    var delay = 0;
    for (var i = 0; i < parent.nEnemies; i++) {
        if (i % 2 === 0) {
            sprite = parent.phaser.game.add.sprite(-100 + (parent.phaser.game.world.randomX), -200, 'ball');
        } else {
            sprite = parent.phaser.game.add.sprite(-100 + (parent.phaser.game.world.randomX), -200, 'ball2');
        }

        sprite.scale.set(parent.phaser.game.rnd.realInRange(0.3, 0.7));


        var speed = parent.phaser.game.rnd.between(10000, 25000);
        sprite.name = "Ball " + i;

        parent.balls.add(sprite);

        parent.phaser.game.add.tween(sprite).to({y: parent.phaser.game.world.height + 100, x: -100 + (parent.phaser.game.world.randomX)}, speed, parent.Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);
        delay += 200;
    }


}

function deletePreviusLevel() {
      if (parent.balls) {
         // console.log(parent.balls.length)
        parent.balls.forEach(function(entry) {
        //  console.log(entry);
          parent.phaser.game.tweens.remove( entry);  
          entry.destroy();
        });  
        parent.balls.removeAll();
        parent.balls.destroy();
    }
}


function evalueLevel() {
    createText("Balls destroyed: " + hits + "/" + nEnemies);
    if (hits >= nEnemies) {
        deletePreviusLevel();
        nEnemies += EnemiesMultiplicator;
        hits = 0;
        levelCreator();
        createText("You WIN!!");
        level++;
        updateLives();
    }
}