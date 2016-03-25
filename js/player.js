function Player() {
	this._height;
	this._width;
	this._dirX = 0;
	this._dirY = 0;
	this._posX;
	this._posY;
	this._color = "white";
	this._dirSet = false;
		
	this.Init = function (speed, startPosX, startPosY, width, height) {
		this._speed = speed;
		this._posX = startPosX;
		this._posY = startPosY;
		this._width = width;
		this._height = height;
	}
	
	this.SetDirection = function (dir) {
		this._dirX = dir;
		this._dirSet = true;
	}
	
	this.Update = function (maxX, maxY) {
		if (((this._posX + this._dirX + this._width) > maxX) || (this._posX + this._dirX - this._width) < 0) {
			// Do nothing... reached border
		} else {
			this._posX = this._posX + (this._dirX * this._speed);
			
			// Reset movement
			if (this._dirSet) {
				this._dirSet = false;
				this._dirX = 0;
			}
		}
	}
		
	// Draw spacefigure
	this.Draw = function (ctx) {
		var tmpLineWidth = ctx.lineWidth;
		ctx.fillStyle = "purple";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo((this._posX),(this._posY + (this._height * (2/3))));
		ctx.quadraticCurveTo((this._posX + (this._width * 0.5)),(this._posY + this._height),(this._posX + this._width),(this._posY + 50));
		ctx.moveTo((this._posX),(this._posY + (this._height * (2/3))));
		ctx.quadraticCurveTo((this._posX + (this._width * 0.5)),(this._posY + (this._height * (1/3))),(this._posX + this._width),(this._posY + (this._height * (2/3))));
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle = "white";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo((this._posX + (this._width * 0.25)),(this._posY + (this._height * (2/3))));
		ctx.quadraticCurveTo((this._posX + (this._width * 0.5)),this._posY,(this._posX + (this._width * 0.75)),(this._posY + 50));
		ctx.moveTo((this._posX + (this._width * 0.25)),(this._posY + (this._height * (2/3))));
		ctx.quadraticCurveTo((this._posX + (this._width * 0.5)),(this._posY + (this._height * (12/15))),(this._posX + (this._width * 0.75)),(this._posY + (this._height * (2/3))));
		ctx.stroke();
		ctx.fill();
		
		ctx.lineWidth = tmpLineWidth;
	}
}