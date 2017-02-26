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
    bubble.kill();
    parent.lives--;
    updateLives();
    player.alpha = 0;
    //tween parpadear la nave despues de morir
    var tween = parent.phaser.game.add.tween(player).to({alpha: 1}, 200, "Linear", true);
    tween.repeat(10, 100);
    evalueLevel();
}

var easeInSpeed = function (x) {
    return x - x / 6;
};
//player fire button
function down() {
   // fireButton = !fireButton;
     fireButton = true;

}
function up() {
    fireButton = false;
}
//screeen firebutton
function actionOnClick() {
    //fireButton = !fireButton;
    //this.game.debug.text("Pulsado", 100, 120);
     //fireButton = true;
}