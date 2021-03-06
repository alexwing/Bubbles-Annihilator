var SimpleGame = (function () {
    function SimpleGame() {


        //creamos el juego ocupando el tamaño que tengamos disponible en el navegador
        this.game = new parent.Phaser.Game("100%", "100%", parent.Phaser.AUTO, 'content', {preload: this.preload, create: this.create, update: this.update, render: this.render});

    }
    SimpleGame.prototype.preload = function () {
        //cargamos los assets desde el fichero de precargas
        parent.preloadClass.level(this.game);

        //You can listen for each of these events from Phaser.Loader
        this.game.load.onLoadStart.add(parent.loadStart, this);
        this.game.load.onFileComplete.add(parent.fileComplete, this);
        this.game.load.onLoadComplete.add(parent.loadComplete, this);
    };
    SimpleGame.prototype.create = function () {

        parent.fullscreenClass.start(this.game); 

        // fireButton = true;
        this.game.touchControl = this.game.plugins.add(parent.Phaser.Plugin.TouchControl);
        this.game.touchControl.inputEnable();
        hits = 0;
        this.game.physics.startSystem(parent.Phaser.Physics.ARCADE);
        this.game.input.gamepad.start();
        //agregamos el fondo
        var background = this.game.add.sprite(0, 0, 'background');

        //ambito del mundo y del scroll mismo que la imagen de fondo
        this.game.world.setBounds(0, 0, background.width, background.height);

        //añado la bola
        bola = this.game.add.sprite(150.5, 150.5, 'bola');

        //añado el personaje y lo situo centrado con respecto a su asset
        this.game.physics.enable(bola, parent.Phaser.Physics.ARCADE);

        bola.body.collideWorldBounds = true;
        bola.body.onWorldBounds = new parent.Phaser.Signal();

        if (parent.smoke === true) {
            smokeEmitter = this.game.add.emitter(0, 0, 400);
            smokeEmitter.width = 10;
            smokeEmitter.makeParticles('smoke');
            //setAlpha(min, max, rate, ease, yoyo)
            smokeEmitter.gravity = 0;
            smokeEmitter.setAlpha(1, 0, 3000);
            //setScale(minX, maxX, minY, maxY, rate, ease, yoyo)
            smokeEmitter.setScale(0.05, 0.4, 0.05, 0.4, 2000, parent.Phaser.Easing.Quintic.Out);
            smokeEmitter.start(false, 5000, 10);
            //start(explode, lifespan, frequency, quantity, forceQuantity)
            smokeEmitter.start(false, 2000, 100, -1);
        }

        parent.createPlayer();


        //programamos los cursores y el boton de fuego
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.fire = this.game.input.keyboard.addKey(parent.Phaser.Keyboard.CONTROL);
        this.pause = this.game.input.keyboard.addKey(parent.Phaser.Keyboard.P);
        //  this.fire = this.game.input.gamepad.
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = parent.Phaser.Physics.ARCADE;
        levelCreator();
        updateLives();
        createButton();

        //sounds
        explosion = this.game.add.audio('explosion');
        blaster = this.game.add.audio('blaster');
        blaster.volume = 0.1;

    };
    SimpleGame.prototype.update = function () {

        // this.game.debug.inputInfo(32, 432);


        var resolution = parent.fullscreenClass.check();

        if (screenResX !== resolution.x | screenResY !== resolution.y) {
            screenResX = resolution.x;
            screenResY = resolution.y;
            parent.fullscreenClass.resize(parent.phaser, screenResX, screenResY);
        }


        //this.game.debug.text(x + ' × ' + y, 100, 120);

        var factorDificultad = (300 + (dificultad * 100));
        bola.body.velocity.y = (acelometroY * factorDificultad);
        bola.body.velocity.x = (acelometroX * (-1 * factorDificultad));


        player.body.velocity.x = easeInSpeed(player.body.velocity.x);
        player.body.velocity.y = easeInSpeed(player.body.velocity.y);

        var speed = this.game.touchControl.speed;

        var angle = 0;
        if (speed.x !== 0 || speed.y !== 0) {
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
        } else
        //arriba-derecha
        if (this.cursors.up.isDown && this.cursors.right.isDown) {
            player.body.velocity.x = velocity;
            player.body.velocity.y = -velocity;
            player.body.rotation = 45;
            xpos = 1;
            ypos = -1;
        } else
        //abajo-izquierda
        if (this.cursors.down.isDown && this.cursors.left.isDown) {
            player.body.velocity.x = -velocity;
            player.body.velocity.y = velocity;
            player.body.rotation = 225;
            xpos = -1;
            ypos = 1;
        } else
        //abajo-derecha
        if (this.cursors.down.isDown && this.cursors.right.isDown) {
            player.body.velocity.y = velocity;
            player.body.velocity.x = velocity;
            player.body.rotation = 135;
            xpos = 1;
            ypos = 1;
        } else
        //izquieda
        if (this.cursors.left.isDown) {
            // player.x -= 4;
            player.body.velocity.x = -velocity;
            player.body.rotation = 270;
            xpos = -1;
            ypos = 0;
        } else
        //derecha
        if (this.cursors.right.isDown) {
            // player.x += 4;
            player.body.velocity.x = velocity;
            player.body.rotation = 90;
            xpos = 1;
            ypos = 0;
        } else
        //arriba
        if (this.cursors.up.isDown) {
            // player.y -= 4;
            player.body.velocity.y = -velocity;
            player.body.rotation = 0;
            xpos = 0;
            ypos = -1;
        } else
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
            } else {
                this.game.paused = true;
            }
        }
        if (this.fire.isDown || this.game.input.gamepad.isDown(parent.Phaser.Gamepad.XBOX360_A) || fireButton) {
            //calcula la secuencia de disparo
            if (this.game.time.now > nextFire) {
                nextFire = this.game.time.now + fireRate;
                //fireButton = false;
                var bulletAnimations = this.game.add.group();
                bulletAnimations.createMultiple(2, 'bullet');
                bulletAnimations.forEach(setupBullet, this);
                var bullet = bulletAnimations.getFirstExists(false);
                bullet.reset(player.x, player.y);
                bullet.anchor.x = 0.8;
                bullet.anchor.y = 1.4;
                this.game.physics.enable(bullet, parent.Phaser.Physics.ARCADE);
                //bullet.body.checkCollision = true;
                //  bullet.play('bullet', 24, true, false);
                bullet.lifespan = 1500;
                //bullet.scale.setTo(0.5, 0.5);
                bullet.rotation = player.rotation;
                bullet.rotation = player.rotation;
                this.game.physics.arcade.velocityFromAngle(bullet.angle - 90, shootVelocity, bullet.body.velocity);
                //bullet.body.moveForward(shootVelocity);
                //bullet.body.angularVelocity = shootVelocity;
                //bullet.body.velocity = shootVelocity;


                var bullet = bulletAnimations.getFirstExists(false);

                bullet.reset(player.x, player.y);
                bullet.anchor.x = 0.2;
                bullet.anchor.y = 1.4;
                this.game.physics.enable(bullet, parent.Phaser.Physics.ARCADE);
                //bullet.body.checkCollision = true;
                // bullet.play('bullet', 24, true, false);
                bullet.lifespan = 1500;
                //bullet.scale.setTo(0.5, 0.5);
                bullet.rotation = player.rotation;
                bullet.rotation = player.rotation;
                this.game.physics.arcade.velocityFromAngle(bullet.angle - 90, shootVelocity, bullet.body.velocity);
                //bullet.body.moveForward(shootVelocity);
                //bullet.body.angularVelocity = shootVelocity;
                //bullet.body.velocity = shootVelocity;                 

                this.bullets.add(bullet);

                blaster.play();
            }
            //detecta cuando un disparo da en un enemigo
            this.game.physics.arcade.overlap(this.bullets, balls, collisionHandler, null, this);
            this.game.physics.arcade.overlap(this.bullets, bola, bolacollisionHandler, null, this);
        }
        //detecta cuando la nave choca con una burbuja
        this.game.physics.arcade.overlap(balls, player, playerDeath, null, this);
        // this.game.debug.text("x: " + player.body.velocity.x, 100, 100);
        // this.game.debug.text("y: " + player.body.velocity.y, 100, 120);
        //  Keep the smokeEmitter lined up with the ship
        if (parent.smoke === true) {
            smokeEmitter.x = player.x;
            smokeEmitter.y = player.y;
            // smokeEmitter.setXSpeed(player.body.velocity.x, player.body.velocity.x);
            // smokeEmitter.setYSpeed(player.body.velocity.y, player.body.velocity.y);
            // smokeEmitter.setRotation(player.rotation, player.rotation);
            if (player.body.velocity.x !== 0) {
                smokeEmitter.visible = true;
            } else {
                smokeEmitter.visible = false;
            }

        }
    };
    SimpleGame.prototype.render = function () {
        // this.game.debug.cameraInfo(this.game.camera, 500, 32);
        // this.game.debug.spriteCoords(player, 32, 32);
        //this.game.debug.physicsBody(player.body);
    };

    return SimpleGame;
}());

//efecto humo en la nave (muy lento)
var smoke = false;
var smokeEmitter = null;

var screenResX = 0;
var screenResY = 0;
//app
var phaser;

//puntuacion
var hits = 0;


var xpos = 1;
var ypos = 1;
var player;


//estrella acelerometro
var bola;
var acelometroX = 0;
var acelometroY = 0;
var dificultad = 0;
//fin acelerometro


//nivel Actual
var level = 1;
//vidas
var lives = 5;
//Numero de enemigos
var nEnemies = 10;
//incremento de enemigos por nivel
var EnemiesMultiplicator = 2;
//velocidad de la nave
var velocity = 400;
//Velocidad de disparo
var shootVelocity = 1500;
//tasa de disparo
var fireRate = 75;
//acumulador del calculo de la tasa de disparo
var nextFire = 0;
var balls;
var button;
var fireButton = false;



function setupExplosions(invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');
}

function setupBullet(invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('bullet');
}


//this code, makes the app run on phonegap or desktop

if (isPhoneGap()) {
    if ('addEventListener' in document) {
        //alert("phonegap");
        document.addEventListener('deviceready', function () {
            watchAccelerometer();
            phaser = new SimpleGame();
            // document.addEventListener("orientationchange", function () {
            //          var resolution = parent.fullscreenClass.check(); 
            //      parent.fullscreenClass.resize(phaser,resolution.x, resolution.y);
            //  });
        }, false);
    }
} else {
    window.onload = function () {
        // alert("windows");
        phaser = new SimpleGame();
        //  window.addEventListener("resize", function () {
        //          var resolution = parent.fullscreenClass.check(); 
        //      parent.fullscreenClass.resize(phaser,resolution.x, resolution.y);
        //  });


    };
  
}

