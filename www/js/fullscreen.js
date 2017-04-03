var fullscreenClass = {
    check: function () {
        var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight || e.clientHeight || g.clientHeight;

        var resolution = [];
        resolution.x = x;
        resolution.y = y;
        return resolution;
    },
    resize: function (phaser, x, y) {
       /* var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight || e.clientHeight || g.clientHeight;*/
        phaser.game.scale.setGameSize(x, y);

        createButton();
    },start: function (phaser) {
    
       phaser.time.events.add(parent.Phaser.Timer.SECOND , this.update, this);
   },update: function (phaser) {
    
      //alert("hola");
   }
};

