var preloadClass = {
    level: function (game) {
        //load assets
        game.load.image('ball', 'res/bubble.png');
        game.load.image('ball2', 'res/bubble2.png');
        game.load.image('background', 'res/space_background.png');
        game.load.image('player', 'res/nave_small.png');
        game.load.image('bola', 'res/deathstar.PNG');
        game.load.spritesheet('kaboom', 'res/explode_small.png', 128, 128);
        game.load.spritesheet('bullet', 'res/FireBall_small.png', 28, 33);
        game.load.spritesheet('button', 'res/arcade_small.png', 125, 125);
        game.load.image('smoke', 'res/smoke.png');
        game.load.image('compass', 'res/compass_rose.png');
        game.load.image('touch', 'res/touch.png');
        game.load.image('touch_segment', 'res/touch_segment.png');
        //load sounds   
        game.load.audio('explosion', 'res/audio/explosion.mp3');
        game.load.audio('blaster', 'res/audio/blaster.mp3');

        game.load.start();
    }
};

function loadStart() {
    createText("Loading ...");
}
function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    createText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
}
function loadComplete() {
    createText("Load Complete");
    parent.phaser.game.scale.startFullScreen(false);

  //  var resolution = parent.fullscreenClass.check();
  //  parent.fullscreenClass.resize(parent.phaser, resolution.x,  resolution.y);

    //  var windowWidth = window.innerWidth;
    //var windowHeight = window.innerHeight;
    //var pixelRatio = window.devicePixelRatio || 1; /// get pixel ratio of device
    //
    //canvasMain = document.getElementById("phaser");
    //
    //canvasMain.width = windowWidth * pixelRatio;   /// resolution of canvas
    //canvasMain.height = windowHeight * pixelRatio;

    //canvasMain.style.width = windowWidth + 'px';   /// CSS size of canvas
    //canvasMain.style.height = windowHeight +  'px';   
    //parent.phaser.game.scale.setGameSize(window.screen.width * window.devicePixelRatio, window.screen.height * window.devicePixelRatio);
    //parent.phaser.game.scale.setGameSize(window.screen.width * window.devicePixelRatio, window.screen.height * window.devicePixelRatio);
}