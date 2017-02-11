var SimpleGame = (function () {
    function SimpleGame() {
        //creamos el juego ocupando el tamaño que tengamos disponible en el navegador
        this.game = new Phaser.Game("100%", "100%", Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }
    SimpleGame.prototype.preload = function () {
        //cargamos los assets
        this.game.load.image('ball', 'res/bubble256.png');
        this.game.load.image('ball2', 'res/bubble2.png');
        this.game.load.image('background', 'res/space_background.png');
        this.game.load.image('player', 'res/nave_small.png');
        this.game.load.image('bola', 'res/deathstar.PNG');
        this.game.load.spritesheet('kaboom', 'res/explode_small.png', 128, 128);
        this.game.load.spritesheet('bullet', 'res/FireBall_small.png', 32, 37);
        this.game.load.spritesheet('button', 'res/arcade_small.png', 125, 125);
        this.game.load.image('smoke', 'res/smoke.png');
        this.game.load.image('compass', 'res/compass_rose.png');
        this.game.load.image('touch', 'res/touch.png');
        this.game.load.image('touch_segment', 'res/touch_segment.png');
        this.game.load.start();
    };
    SimpleGame.prototype.create = function () {
        // fireButton = true;
        this.game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
        this.game.touchControl.inputEnable();
        hits = 0;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.input.gamepad.start();
        //agregamos el fondo
        var background = this.game.add.sprite(0, 0, 'background');
        //background.scale.setTo(0.5, 0.5);
        //ambito del mundo y del scroll mismo que la imagen de fondo
        this.game.world.setBounds(0, 0, background.width, background.height);
        /* shipTrail = this.game.add.emitter(0, 0, 400);
         shipTrail.width = 10;
         shipTrail.makeParticles('smoke');
         shipTrail.setAlpha(1, 0.01, 800);
         shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
         shipTrail.start(false, 5000, 10);*/
        //añado el personaje y lo situo centrado con respecto a su asset
        bola = this.game.add.sprite(150.5, 150.5, 'bola');
        this.game.physics.enable(bola, Phaser.Physics.ARCADE);
        
        bola.body.collideWorldBounds = true;
        bola.body.onWorldBounds = new Phaser.Signal();
    
        
        player = this.game.add.sprite(100.5, 100.5, 'player');
        //player.scale.setTo(0.5, 0.5);
        //player.scale.set(0.1);
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        //  Add an emitter for the ship's trail
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        //el player choca con los bordes del escenario
        player.body.collideWorldBounds = true;
        //la camara sigue al player
        this.game.camera.follow(player);
        //programamos los cursores y el boton de fuego
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.fire = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        this.pause = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        //  this.fire = this.game.input.gamepad.
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemiesCreator();
        updateLives();
        button = this.game.add.button(this.game.width - 150, this.game.height - 150, 'button', actionOnClick, this, 0, 0, 1);
        button.fixedToCamera = true;
        // button.scale.setTo(0.5, 0.5);
        //  var timer: Phaser.TimerEvent = this.game.time.events.loop(1500, addSprite, this);
        /* button.onInputOver.add(over, this);
         button.onInputOut.add(out, this);
         button.onInputUp.add(up, this);
         button.onInputDown.add(down, this);
         button.onInputDown.add(down, this);*/
        this.game.stage.backgroundColor = '#182d3b';
        //	You can listen for each of these events from Phaser.Loader
        this.game.load.onLoadStart.add(loadStart, this);
        this.game.load.onFileComplete.add(fileComplete, this);
        this.game.load.onLoadComplete.add(loadComplete, this);
    };
    SimpleGame.prototype.update = function () {
        
        var factorDificultad = (300 + (dificultad * 100));
        bola.body.velocity.y = (velocidadY * factorDificultad);
        bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
     
        
        
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        //sthis.player.body.rotation = 0;
        var speed = this.game.touchControl.speed;
        var delay = 0;
        var angle = 0;
        if (speed.x != 0 || speed.y != 0) {
            angle = this.game.touchControl.body.rotation;
            //this.game.debug.text("angle: " +angle, 100, 120);
            player.body.velocity.y += -speed.y * velocity / 50;
            player.body.velocity.x += -speed.x * velocity / 50;
        }
        if (angle) {
            player.body.rotation = angle - 90;
        }
        //arriba-izquierda
        if (this.cursors.up.isDown && this.cursors.left.isDown) {
            player.body.velocity.x = -velocity;
            player.body.velocity.y = -velocity;
            player.body.rotation = 315;
            xpos = -1;
            ypos = -1;
        }
        else 
        //arriba-derecha
        if (this.cursors.up.isDown && this.cursors.right.isDown) {
            player.body.velocity.x = velocity;
            player.body.velocity.y = -velocity;
            player.body.rotation = 45;
            xpos = 1;
            ypos = -1;
        }
        else 
        //abajo-izquierda
        if (this.cursors.down.isDown && this.cursors.left.isDown) {
            player.body.velocity.x = -velocity;
            player.body.velocity.y = velocity;
            player.body.rotation = 225;
            xpos = -1;
            ypos = 1;
        }
        else 
        //abajo-derecha
        if (this.cursors.down.isDown && this.cursors.right.isDown) {
            player.body.velocity.y = velocity;
            player.body.velocity.x = velocity;
            player.body.rotation = 135;
            xpos = 1;
            ypos = 1;
        }
        else 
        //izquieda
        if (this.cursors.left.isDown) {
            // player.x -= 4;
            player.body.velocity.x = -velocity;
            player.body.rotation = 270;
            xpos = -1;
            ypos = 0;
        }
        else 
        //derecha
        if (this.cursors.right.isDown) {
            // player.x += 4;
            player.body.velocity.x = velocity;
            player.body.rotation = 90;
            xpos = 1;
            ypos = 0;
        }
        else 
        //arriba
        if (this.cursors.up.isDown) {
            // player.y -= 4;
            player.body.velocity.y = -velocity;
            player.body.rotation = 0;
            xpos = 0;
            ypos = -1;
        }
        else 
        //abajo
        if (this.cursors.down.isDown) {
            // player.y += 4;
            player.body.velocity.y = velocity;
            player.body.rotation = 180;
            xpos = 0;
            ypos = 1;
        }
        /*if (this.game.input.gamepad.isDown(Phaser.Gamepad.XBOX360_STICK_LEFT_X))
        {
            this.game.debug.text("xbox buttom: " + this.game.input.gamepad.justReleased(Phaser.Gamepad.XBOX360_STICK_LEFT_X)
                , 100, 100);

        }

        if (this.game.input.gamepad.justReleased(Phaser.Gamepad.XBOX360_B)) {
            player.body.scale += 0.01;

        }*/
        if (this.pause.justDown) {
            if (this.game.paused) {
                this.game.paused = false;
            }
            else {
                this.game.paused = true;
            }
        }
        if (this.fire.isDown || this.game.input.gamepad.isDown(Phaser.Gamepad.XBOX360_A) || fireButton) {
            //calcula la secuencia de disparo
            if (this.game.time.now > nextFire) {
                nextFire = this.game.time.now + fireRate;
                fireButton = false;
                var bulletAnimations = this.game.add.group();
                bulletAnimations.createMultiple(3, 'bullet');
                bulletAnimations.forEach(setupBullet, this);
                var bullet = bulletAnimations.getFirstExists(false);
                bullet.reset(player.x, player.y);
                bullet.anchor.x = 0.5;
                bullet.anchor.y = 0.5;
                this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
                //bullet.body.checkCollision = true;
                bullet.play('bullet', 30, true, false);
                bullet.lifespan = 2000;
                //bullet.scale.setTo(0.5, 0.5);
                bullet.rotation = player.rotation;
                bullet.rotation = player.rotation;
                this.game.physics.arcade.velocityFromAngle(bullet.angle - 90, shootVelocity, bullet.body.velocity);
                //bullet.body.moveForward(shootVelocity);
                //bullet.body.angularVelocity = shootVelocity;
                // bullet.body.velocity = shootVelocity;
                this.bullets.add(bullet);
            }
            //detecta cuando un disparo da en un enemigo
            this.game.physics.arcade.overlap(this.bullets, balls, collisionHandler, null, this);
             this.game.physics.arcade.overlap(this.bullets, bola, bolacollisionHandler, null, this);
        }
        //detecta cuando la nave choca con una burbuja
        this.game.physics.arcade.overlap(balls, player, playerDeath, null, this);
        // this.game.debug.text("x: " + player.body.velocity.x, 100, 100);
        // this.game.debug.text("y: " + player.body.velocity.y, 100, 120);
        //  Keep the shipTrail lined up with the ship
        /* shipTrail.x = player.x;
         shipTrail.y = player.y;
         shipTrail.setXSpeed(player.body.velocity.x,- player.body.velocity.x);
         shipTrail.setYSpeed(player.body.velocity.y, -player.body.velocity.y);
         shipTrail.setRotation(player.rotation, player.rotation);*/
    };
    SimpleGame.prototype.render = function () {
        //this.game.debug.cameraInfo(this.game.camera, 500, 32);
        // this.game.debug.spriteCoords(player, 32, 32);
        //this.game.debug.physicsBody(player.body);
    };
    SimpleGame.prototype.explosionCreate = function (x, y, scale) {
        //  An explosion pool
        var explosions;
        explosions = this.game.add.group();
        explosions.createMultiple(30, 'kaboom');
        explosions.forEach(setupInvader, this);
        var explosion = explosions.getFirstExists(false);
        explosion.reset(x, y);
        explosion.scale.x = explosion.scale.y = scale * 2;
        explosion.anchor.x = 0.5;
        explosion.anchor.y = 0.5;
        // explosion.alpha = 0.5;
        explosion.play('kaboom', 60, false, true);
        explosion.lifespan = 1000;
    };
    return SimpleGame;
}());
function loadStart() {
    createText("Loading ...");
}
//	This callback is sent the following parameters:
function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    createText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
    //this.phaser.game.text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
}
function loadComplete() {
    createText("Load Complete");
}
function addSprite() {
    if (button) {
        button.kill();
    }
    button = phaser.game.add.button(phaser.game.width - 300, phaser.game.height - 300, 'button', actionOnClick, this, 0, 0, 1);
    button.fixedToCamera = true;
}
var phaser;
var hits = 0;
var text = null;
var liveText = null;
//var shipTrail: Phaser.Particles.Arcade.Emitter;
var xpos = 1;
var ypos = 1;
var player;


//estrella acelerometro
var bola;
var velocidadX=0;
var velocidadY=0;
var dificultad=0;
//fin acelerometro


//nivel Actual
var level = 1;
//vidas
var lives = 5;
//Numero de enemigos
var nEnemies = 10;
//incremento de enemigos por nivel
var EnemiesMultiplicator = 5;
//velocidad de la nave
var velocity = 400;
//Velocidad de disparo
var shootVelocity = 1100;
//tasa de disparo
var fireRate = 75;
//acumulador del calculo de la tasa de disparo
var nextFire = 0;
var balls;
var button;
var fireButton = false;
var easeInSpeed = function (x) {
    return x * Math.abs(x) / 2000;
};
function up() {
    fireButton = false;
}
function over() {
}
function actionOnClick() {
    fireButton = !fireButton;
    //this.game.debug.text("Pulsado", 100, 120);
    // fireButton = true;
}
function down() {
    fireButton = !fireButton;
}
function out() {
    fireButton = false;
}
function createLiveText(content) {
    if (liveText) {
        liveText.kill();
    }
    liveText = this.phaser.game.add.text(32, 32, content);
    liveText.fixedToCamera = true;
    //text.anchor.setTo(0.5);
    liveText.font = 'Verdana';
    liveText.fontSize = 30;
    //  x0, y0 - x1, y1
    var grd;
    grd = liveText.context.createLinearGradient(0, 0, 0, liveText.canvas.height);
    grd.addColorStop(0, '#ff0000');
    grd.addColorStop(1, '#440000');
    liveText.fill = grd;
    liveText.align = 'center';
    liveText.stroke = '#000000';
    liveText.strokeThickness = 2;
    liveText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);
    // liveText.inputEnabled = true;
    // liveText.input.enableDrag();
}
function createText(content) {
    if (text) {
        text.kill();
    }
    text = this.phaser.game.add.text(32, 64, content);
    text.fixedToCamera = true;
    //text.anchor.setTo(0.5);
    text.font = 'Verdana';
    text.fontSize = 30;
    //  x0, y0 - x1, y1
    var grd;
    grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;
    text.align = 'center';
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);
    //text.inputEnabled = true;
    //text.input.enableDrag();
    //text.events.onInputOver.add(over, this);
    //text.events.onInputOut.add(out, this);
}
/*function out() {

    text.fill = grd;

}

function over() {

    text.fill = '#ff00ff';

}*/
function playerDeath(player, bubble) {
    hits++;
    phaser.explosionCreate(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), player.scale.x);
    //  And create an explosion :)
    //phaser.game.debug.text(ball.name + " collition " + hits, 32, 62);
    // fire.kill();
    bubble.kill();
    lives--;
    updateLives();
    player.alpha = 0;
    var tween = phaser.game.add.tween(player).to({ alpha: 1 }, 200, "Linear", true);
    //  And this tells it to repeat, i.e. fade in again 10 times.
    //  The 1000 tells it to wait for 1 second before restarting the fade.
    tween.repeat(10, 100);
    evalueLevel();
}
function collisionHandler(fire, ball ) {
    hits++;
    phaser.explosionCreate(ball.body.x + (ball.body.width / 2), ball.body.y + (ball.body.height / 2), ball.scale.x);
    //  And create an explosion :)
    //phaser.game.debug.text(ball.name + " collition " + hits, 32, 62);
    fire.kill();
    ball.kill();
    //createText(ball.name + " Balls destroyed: " + hits);
    //createText("Balls destroyed: " + hits + "/" + ball.parent.total);
    evalueLevel();
}

function bolacollisionHandler(ball, fire) {
    hits++;
    phaser.explosionCreate(ball.body.x + (ball.body.width / 2), ball.body.y + (ball.body.height / 2), ball.scale.x);
    //  And create an explosion :)
    //phaser.game.debug.text(ball.name + " collition " + hits, 32, 62);
    fire.kill();
    //ball.kill();
    //createText(ball.name + " Balls destroyed: " + hits);
    //createText("Balls destroyed: " + hits + "/" + ball.parent.total);
    evalueLevel();
}
function evalueLevel() {
    createText("Balls destroyed: " + hits + "/" + nEnemies);
    if (hits >= nEnemies) {
        nEnemies += EnemiesMultiplicator;
        hits = 0;
        enemiesCreator();
        createText("You WIN!!");
        level++;
        updateLives();
    }
}
function setupInvader(invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');
}
function updateLives() {
    createLiveText("level:" + level + " lives:" + lives);
}
function setupBullet(invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('bullet');
}
function enemiesCreator() {
    if (balls) {
        balls.removeAll();
        balls.destroy();
    }
    //creamos las burbujas
    balls = phaser.game.add.group();
    balls.enableBody = true;
    balls.physicsBodyType = Phaser.Physics.ARCADE;
    var delay = 0;
    for (var i = 0; i < nEnemies / 2; i++) {
        var sprite;
        sprite = phaser.game.add.sprite(-100 + (phaser.game.world.randomX), -200, 'ball');
        sprite.scale.set(phaser.game.rnd.realInRange(0.1, 0.3));
        // this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
        //sprite.body.checkCollision = true;
        var speed = phaser.game.rnd.between(10000, 25000);
        sprite.name = "Ball " + i;
        // sprite.anchor.x = 0.5;
        //sprite.anchor.y = 0.5;
        balls.add(sprite);
        // sprite.body.velocity.y = 40;
        // this.game.add.tween(sprite).to({ y: this.game.world.height + 200 }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);
        phaser.game.add.tween(sprite).to({ y: phaser.game.world.height + 200, x: -100 + (phaser.game.world.randomX) }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);
        delay += 200;
    }
    shootToMe();
}
function vigilaSensores() {
    function onError() {
        console.log('onError!');
    }
    function onSuccess(datosAceleracion) {
        velocidadX = datosAceleracion.x ;
        velocidadY = datosAceleracion.y ;
    }
    navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 10 });
}

function shootToMe() {
    var delay = 0;
    for (var i = 0; i < nEnemies / 2; i++) {
        var sprite;
        sprite = phaser.game.add.sprite(-100 + (phaser.game.world.randomX), -200, 'ball2');
        // sprite.scale.set(phaser.game.rnd.realInRange(0.1, 0.6));
        // this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
        //sprite.body.checkCollision = true;
        var speed = phaser.game.rnd.between(10000, 20000);
        sprite.name = "Ball " + i;
        // sprite.anchor.x = 0.5;
        //sprite.anchor.y = 0.5;
        balls.add(sprite);
        // sprite.body.velocity.y = 40;
        // this.game.add.tween(sprite).to({ y: this.game.world.height + 200 }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);
        // phaser.game.add.tween(sprite).to({ x: player.body.x, y: player.body.y }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);
        phaser.game.add.tween(sprite).to({ y: phaser.game.world.height + 200, x: -100 + (phaser.game.world.randomX) }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);
        delay += 200;
    }
}
function shoot() {
    var sprite = phaser.game.add.sprite(1, player.body.x, 'bullet');
}
/*window.onload = function () {
    phaser = new SimpleGame();
};*/
if ('addEventListener' in document) {
    document.addEventListener('deviceready', function () {
        phaser = new SimpleGame();
        vigilaSensores();
    }, false);
}
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map