function collisionHandler(fire, ball) {
    parent.hits++;
    parent.phaser.explosionCreate(ball.body.x + (ball.body.width / 2), ball.body.y + (ball.body.height / 2), ball.scale.x);
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
    parent.phaser.explosionCreate(ball.body.x + (ball.body.width / 2), ball.body.y + (ball.body.height / 2), ball.scale.x);
    //  And create an explosion :)
    //phaser.game.debug.text(ball.name + " collition " + hits, 32, 62);
    fire.kill();
    //ball.kill();
    //createText(ball.name + " Balls destroyed: " + hits);
    //createText("Balls destroyed: " + hits + "/" + ball.parent.total);
    evalueLevel();
}