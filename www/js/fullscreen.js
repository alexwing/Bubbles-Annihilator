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
        
        //por alguna razon tengo que sumarle 4 pixels para que funcione en el samsung s7
        phaser.game.scale.setGameSize(x+3, y+3);
        //alert("x"+x+"y"+y);

        createButton();
    },start: function (phaser) {
    
       phaser.time.events.add(parent.Phaser.Timer.SECOND , this.update, this);
   },update: function (phaser) {
    
      //alert("hola");
   }
};

