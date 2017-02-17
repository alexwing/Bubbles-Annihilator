function createPlayer() {
    player = this.phaser.game.add.sprite(100.5, 100.5, 'player');

    
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    

    this.phaser.game.physics.enable(player, parent.Phaser.Physics.ARCADE);
    
    //el player choca con los bordes del escenario
    player.body.collideWorldBounds = true;
    
    //la camara sigue al player
    this.phaser.game.camera.follow(player);
}
function playerDeath(player, bubble) {
    parent.hits++;
    parent.phaser.explosionCreate(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), player.scale.x);
    //  And create an explosion :)
    //phaser.game.debug.text(ball.name + " collition " + hits, 32, 62);
    // fire.kill();
    bubble.kill();
    parent.lives--;
    updateLives();
    player.alpha = 0;
    var tween = parent.phaser.game.add.tween(player).to({alpha: 1}, 200, "Linear", true);
    //  And this tells it to repeat, i.e. fade in again 10 times.
    //  The 1000 tells it to wait for 1 second before restarting the fade.
    tween.repeat(10, 100);
    evalueLevel();
}