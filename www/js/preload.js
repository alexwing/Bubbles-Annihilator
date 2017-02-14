var pregarga={
  fase: function(game){
        //cargamos los assets
       game.load.image('ball', 'res/bubble256.png');
       game.load.image('ball2', 'res/bubble2.png');
       game.load.image('background', 'res/space_background.png');
       game.load.image('player', 'res/nave_small.png');
       game.load.image('bola', 'res/deathstar.PNG');
       game.load.spritesheet('kaboom', 'res/explode_small.png', 128, 128);
       game.load.spritesheet('bullet', 'res/FireBall_small.png', 32, 37);
       game.load.spritesheet('button', 'res/arcade_small.png', 125, 125);
       game.load.image('smoke', 'res/smoke.png');
       game.load.image('compass', 'res/compass_rose.png');
       game.load.image('touch', 'res/touch.png');
       game.load.image('touch_segment', 'res/touch_segment.png');
       game.load.start();      
  }
};