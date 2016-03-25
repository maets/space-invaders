function Shot() {
	this._height = 3;
	this._width = 1;
	this._dirX = 0;
	this._dirY = -1;
	this._posX;
	this._posY;
	this._speed = 10;
	this._isActive = true;
		
	this.Init = function (startPosX, startPosY) {
		this._posX = startPosX;
		this._posY = startPosY;
	}
	
	this.Draw = function (ctx) {
	    if (this._isActive) {
			ctx.strokeStyle = "white";
			ctx.beginPath();
			ctx.moveTo(this._posX, this._posY);
			ctx.lineTo(this._posX, (this._posY + this._height));
			ctx.stroke();
		}
	}
	
	this.IsActive = function () {
		return this._isActive;
	}
	
	this.Update = function (maxX, maxY) {
		if ((this._posY + (this._dirY * this._speed)) < 0)
			this._isActive = false;
		else
			this._posY = this._posY + (this._dirY * this._speed);
	}
	
	this.GetPosition = function () {
		return {
			X: this._posX,
			Y: this._posY
		};
	}
}