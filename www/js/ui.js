

function createLiveText(content) {
    if (parent.liveText) {
        parent.liveText.kill();
    }
    parent.liveText = this.phaser.game.add.text(32, 32, content);
    parent.liveText.fixedToCamera = true;
    //text.anchor.setTo(0.5);
    parent.liveText.font = 'Verdana';
    parent.liveText.fontSize = 30;
    //  x0, y0 - x1, y1
    var grd;
    grd = parent.liveText.context.createLinearGradient(0, 0, 0, parent.liveText.canvas.height);
    grd.addColorStop(0, '#ff0000');
    grd.addColorStop(1, '#440000');
    parent.liveText.fill = grd;
    parent.liveText.align = 'center';
    parent.liveText.stroke = '#000000';
    parent.liveText.strokeThickness = 2;
    parent.liveText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);

    // liveText.inputEnabled = true;
    // liveText.input.enableDrag();
}
function createText(content) {
    if (parent.text) {
        parent.text.kill();
    }
    parent.text = this.phaser.game.add.text(32, 64, content);
    parent.text.fixedToCamera = true;
    //text.anchor.setTo(0.5);
    parent.text.font = 'Verdana';
    parent.text.fontSize = 30;
    //  x0, y0 - x1, y1
    var grd;
    grd = parent.text.context.createLinearGradient(0, 0, 0, parent.text.canvas.height);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    parent.text.fill = grd;
    parent.text.align = 'center';
    parent.text.stroke = '#000000';
    parent.text.strokeThickness = 2;
    parent.text.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);
    //parent.text.inputEnabled = true;
    //parent.text.input.enableDrag();
    //parent.text.events.onInputOver.add(over, this);
    //parent.text.events.onInputOut.add(out, this);
}

function updateLives() {
    createLiveText("level:" + level + " lives:" + lives);
}

function isPhoneGap() {
    return (window.cordova || window.PhoneGap || window.phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

function createButton() {
    if (parent.button){
        parent.button.destroy();
    }
    parent.button = this.phaser.game.add.button(this.phaser.game.width - 150, this.phaser.game.height - 150, 'button', null, this, 0, 0, 1);
    parent.button.fixedToCamera = true;
    parent.button.onInputDown.add(parent.screenButtonDown, this);
    parent.button.onInputUp.add(parent.screenButtonUp, this);

}