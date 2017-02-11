class Controller {

  
    constructor(player, cursors) {
       
        this.player = player;
        this.cursors = cursors;
    }
    update() {

        if (this.cursors.down.isDown) {
            // player.y += 4;
            this.player.body.velocity.y = velocity;
            this.player.body.rotation = 180;
            this.xpos = 0;
            this.ypos = 1;
        }
    }
}

const velocity = 400;
const shootVelocity = 900;