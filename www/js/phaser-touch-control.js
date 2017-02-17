/* global Phaser */
/**
  * Phaser Touch Control Plugin
  * It adds a movement control for mobile and tablets devices

	The MIT License (MIT)

	Copyright (c) 2014 Eugenio Fage

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

	Contact: https://github.com/eugenioclrc, @eugenioclrc

  */

(function(window, Phaser) {
	'use strict';
	/**
	  * TouchControl Plugin for Phaser
	  */
	Phaser.Plugin.TouchControl = function(game, parent) {
		/* Extend the plugin */
		Phaser.Plugin.call(this, game, parent);
		this.input = this.game.input;

		// Reference to the pointer controlling the joystick.
		this.pointer = null;

		this.imageGroup = [];
		this.imageGroup.push(this.game.add.sprite(0, 0, 'compass'));
		this.imageGroup.push(this.game.add.sprite(0, 0, 'touch_segment'));
		this.imageGroup.push(this.game.add.sprite(0, 0, 'touch_segment'));
		this.imageGroup.push(this.game.add.sprite(0, 0, 'touch'));

		this.imageGroup.forEach(function (e) {
		    e.anchor.set(0.5);
		    e.visible=false;
		    e.fixedToCamera=true;
		});
		this.fixedPosition = null;
	};

	//Extends the Phaser.Plugin template, setting up values we need
	Phaser.Plugin.TouchControl.prototype = Object.create(Phaser.Plugin.prototype);
	Phaser.Plugin.TouchControl.prototype.constructor = Phaser.Plugin.TouchControl;

	Phaser.Plugin.TouchControl.prototype.settings = {
		// max distance from initial touch or fixed position
		maxDistanceInPixels: 50,
		singleDirection: false,
		numberOfSegments: 2,
                maxVelocity: 20
	};

	Phaser.Plugin.TouchControl.prototype.init = function(baseImage, touchImage, segmentImage) {
		if(Array.isArray(baseImage)) {
			this.imageGroup.push(this.game.add.image(0, 0, baseImage[0], baseImage[1]));
		} else if(typeof baseImage === 'string') {
			this.imageGroup.push(this.game.add.image(0, 0, baseImage));
		}

		if(this.settings.numberOfSegments > 0 && segmentImage) {
			for(var i = 0; i < this.settings.numberOfSegments; i++) {
				if(Array.isArray(segmentImage)) {
					this.imageGroup.push(this.game.add.image(0, 0, segmentImage[0], segmentImage[1]));
				} else if(typeof segmentImage === 'string') {
					this.imageGroup.push(this.game.add.image(0, 0, segmentImage));
				}
			}
		}

		if(Array.isArray(touchImage)) {
			this.imageGroup.push(this.game.add.image(0, 0, touchImage[0], touchImage[1]));
		} else if(typeof touchImage === 'string') {
			this.imageGroup.push(this.game.add.image(0, 0, touchImage));
		}

		this.imageGroup.forEach(function(e) {
			e.anchor.set(0.5);
			e.visible = false;
			e.fixedToCamera = true;
		});

	};

	Phaser.Plugin.TouchControl.prototype.cursors = {
		up: false, down: false, left: false, right: false
	};

	Phaser.Plugin.TouchControl.prototype.speed = {
		x: 0, y: 0
	};
    Phaser.Plugin.TouchControl.prototype.body = {
        rotation: 0,
        xQuadrant: 0,
        yQuadrant:0
    };
 
	Phaser.Plugin.TouchControl.prototype.inputEnable = function(x, y) {
		if(typeof x == 'number' && typeof y == 'number') {
			this.fixedPosition = new Phaser.Point(x, y);
			this.showCompass();
		} else {
			this.fixedPosition = null;
		}

		this.input.onDown.add(connectCompass, this);
		this.input.onUp.add(disconnectCompass, this);
	};

	Phaser.Plugin.TouchControl.prototype.inputDisable = function() {
		this.input.onDown.remove(connectCompass, this);
		this.input.onUp.remove(disconnectCompass, this);
	};

	Phaser.Plugin.TouchControl.prototype.showCompass = function() {
		this.imageGroup.forEach(function(e) {
			e.visible = true;
			e.bringToTop();

			if(this.fixedPosition !== null) {
				e.cameraOffset.x = this.fixedPosition.x;
				e.cameraOffset.y = this.fixedPosition.y;
			} else if(this.pointer) {
				e.cameraOffset.x = this.pointer.worldX;
				e.cameraOffset.y = this.pointer.worldY;
			}

		}, this);
	};

	Phaser.Plugin.TouchControl.prototype.hideCompass = function() {
		this.imageGroup.forEach(function(e) {
			e.visible = false;
		});
	};

	var initialPoint = new Phaser.Point();
	var connectCompass = function(pointer) {
		if(!this.pointer) {
			if(this.fixedPosition && (
				pointer.position.x > this.fixedPosition.x + this.settings.maxDistanceInPixels ||
				pointer.position.x < this.fixedPosition.x - this.settings.maxDistanceInPixels ||
				pointer.position.y > this.fixedPosition.y + this.settings.maxDistanceInPixels ||
				pointer.position.y < this.fixedPosition.y - this.settings.maxDistanceInPixels
				)) {
				return;
			}

			this.pointer = pointer;

			if(this.fixedPosition) {
				initialPoint.copyFrom(this.fixedPosition);
			} else {
				this.pointer = pointer;
				initialPoint.copyFrom(this.pointer.position);
				this.showCompass();
			}

			this.preUpdate = setDirection.bind(this);
		}
	};
	var disconnectCompass = function(pointer) {
		if(pointer === this.pointer) {
			this.pointer = null;

			if(this.fixedPosition) {
				this.imageGroup.forEach(function(e) {
					e.cameraOffset.x = this.fixedPosition.x;
					e.cameraOffset.y = this.fixedPosition.y;
				}, this);
			} else {
				this.hideCompass();
			}

			this.cursors.up = false;
			this.cursors.down = false;
			this.cursors.left = false;
			this.cursors.right = false;

			this.speed.x = 0;
			this.speed.y = 0;

			this.preUpdate = empty;
		}
	};

	var empty = function() {
	};

	var setDirection = function() {
		var d = initialPoint.distance(this.pointer.position);
		var maxDistanceInPixels = this.settings.maxDistanceInPixels;
                var maxVelocity = this.settings.maxVelocity;

		var deltaX = this.pointer.position.x - initialPoint.x;
		var deltaY = this.pointer.position.y - initialPoint.y;

		var angle = initialPoint.angle(this.pointer.position);

		if(d > maxDistanceInPixels) {
			deltaX = Math.cos(angle) * maxDistanceInPixels;
			deltaY = Math.sin(angle) * maxDistanceInPixels;
		}

		if(this.settings.singleDirection) {
			if(Math.abs(deltaX) > Math.abs(deltaY)) {
				deltaY = 0;
				this.pointer.position.y = initialPoint.y;
			}else{
				deltaX = 0;
				this.pointer.position.x = initialPoint.x;
			}
		}

		this.speed.x = parseInt((deltaX / maxDistanceInPixels) * maxVelocity * -1, 10);
		this.speed.y = parseInt((deltaY / maxDistanceInPixels) * maxVelocity * -1, 10);
		this.body.rotation = getAngle(this.speed.x, this.speed.y)
		
		this.cursors.up = (deltaY < 0);
		this.cursors.down = (deltaY > 0);
		this.cursors.left = (deltaX < 0);
		this.cursors.right = (deltaX > 0);
		
		this.imageGroup.forEach(function(e, i) {
			e.cameraOffset.x = initialPoint.x + deltaX * i / (this.imageGroup.length - 1);
			e.cameraOffset.y = initialPoint.y + deltaY * i / (this.imageGroup.length - 1);
		}, this);
		
	};

	Phaser.Plugin.TouchControl.prototype.preUpdate = empty;

	Phaser.Plugin.TouchControl.prototype.destroy = function() {
		if(this.pointer) {
			disconnectCompass.call(this, this.pointer);
		}
		this.inputDisable();

		Phaser.Plugin.prototype.destroy.call(this);
	};

}(window, Phaser));


function getAngle(x, y) {

    switch (getQuadrant(x, y)) {
        case 1:
            return Math.asin(y / hypot(x, y)) * 180 / Math.PI;
        case 2:
            return 180 - Math.asin(y / hypot(x, y)) * 180 / Math.PI;
        case 3:
            return 180 + (-1 * Math.asin(y / hypot(x, y)) * 180 / Math.PI);
        case 4:
            return 360 + Math.asin(y / hypot(x, y)) * 180 / Math.PI;
        default:
            return 0;
    }

}

function hypot(x, y) { return Math.sqrt(x * x + y * y) }
/**
 * @return The selected quadrant.
 */
function getQuadrant(x, y) {
    if (x >= 0) {
        return y >= 0 ? 1 : 4;
    } else {
        return y >= 0 ? 2 : 3;
    }
}
