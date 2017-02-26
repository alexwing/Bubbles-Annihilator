function collisionHandler(fire, ball) {
    parent.hits++;
    explosionCreate(ball.body.x + (ball.body.width / 2), ball.body.y + (ball.body.height / 2), ball.scale.x);
    //  And create an explosion :)
    //phaser.game.debug.text(ball.name + " collition " + hits, 32, 62);
    fire.kill();
    ball.kill();
    //createText(ball.name + " Balls destroyed: " + hits);
    //createText("Balls destroyed: " + hits + "/" + ball.parent.total);
    evalueLevel();
}

function bolacollisionHandler(ball, fire) {
    parent.hits++;
    explosionCreate(ball.body.x + (ball.body.width / 2), ball.body.y + (ball.body.height / 2), ball.scale.x);
    fire.kill();
    evalueLevel();
}

function explosionCreate(x, y, scale) {
    //  An explosion pool
    var explosions;
    explosions = this.phaser.game.add.group();
    explosions.createMultiple(1, 'kaboom');
    explosions.forEach(parent.setupExplosions, this);
    var explosion = explosions.getFirstExists(false);
    explosion.reset(x, y);
    explosion.scale.x = explosion.scale.y = scale * 2;
    explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.alpha = 0.8;
    explosion.play('kaboom', 25, false, true);
    explosion.lifespan = 2000;
};