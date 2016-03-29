function Monster() {
	this._justSpawned; // Used to keep track if a monster just have been spawned so we can make an exception to x/y vs boundary rules
    this._speed;
	this._color;
	this._borderColor;
	this._height;
	this._width;
	this._health;
	this._dirX;
	this._dirY = 0;
	this._posX;
	this._posY;
	this._maxStepY;
	this._causeGameOver = false;
	this._moveMode = 1; // 1 = x, 2 = y
		
	this.Init = function (speed, color, borderColor, startPosX, startPosY, height, width) {
		this._speed = speed;
		this._color = color;
		this._borderColor = borderColor;
		this._posX = startPosX;
		this._posY = startPosY;
		this._dirX = speed * 1;
		this._dirY = speed * 1;
		this._height = height;
		this._width = width;
		this._isDying = false;
		this._hasExploded = false;
		this._deathTimer = 0;
        this._justSpawned = true;
		this._maxStepY = this._posY + (this._height * 5);
	}
	
	this.Update = function (maxX, maxY) {
		if (this._isDying) {
			if (!this._hasExploded) {
				this._posX = this._posX - 5;
				this._width = this._width + 10;
				this._posY = this._posY - 5;
				this._height = this._height + 10;
				this._deathTimer = this._deathTimer + 1;
			}
		} else {
			if (this._moveMode == 1) { // X position
				if (((this._posX + this._dirX + this._width) > maxX) || (!this._justSpawned && (this._posX + this._dirX - this._width) < 0)) {
					this._moveMode = 2;
				} else {
					this._posX = this._posX + this._dirX;
				}
			} else if (this._moveMode == 2) { // Y position
				if ((this._posY + this._dirY + this._height) > this._maxStepY) {
					this._moveMode = 1;
                    this._justSpawned = false;
					this._dirX = this._dirX * -1;
					this._maxStepY = this._posY + (this._height * 5); 
				} else if ((this._posY + this._dirY + this._height) > maxY) {
					this._causeGameOver = true;
				} else {
					this._posY = this._posY + this._dirY;
				}
			}
		}
		
		if (this._deathTimer == 20) 
			this._hasExploded = true;
	}
	
	this.IsHit = function (shot) {
		if ((shot._posX > this._posX) && (shot._posX < (this._posX + this._width)) &&
			(shot._posY > this._posY) && (shot._posY < (this._posY + this._height))) {
			this._isDying = true;
			this._color = "gray";
		}
		return this._isDying;
	}
	
	this.HasExploded = function () {
		return this._hasExploded;
	}
	
	// this.Draw = function (ctx) {
		// ctx.beginPath();
		// ctx.strokeStyle = this._color;
		// ctx.strokeRect(this._posX, this._posY, this._width, this._height);
		// ctx.stroke();
	// }
	
	this.Draw = function (ctx) {
		if (this._isDying) {
			this.DrawDying(ctx);
		} else {
			this.DrawAlive(ctx);
		}
	}
	
	this.DrawAlive = function (ctx) {
		ctx.fillStyle=this._color;
		
		ctx.beginPath();
		// Lower part
		ctx.moveTo((this._posX + (this._width / 5) * 0), (this._posY + (this._height / 3) * 1.5));
		ctx.lineTo((this._posX + (this._width / 5) * 1), (this._posY + (this._height / 3) * 2));
		ctx.lineTo((this._posX + (this._width / 5) * 2), (this._posY + (this._height / 3) * 3));
		ctx.lineTo((this._posX + (this._width / 5) * 3), (this._posY + (this._height / 3) * 2));
		ctx.lineTo((this._posX + (this._width / 5) * 4), (this._posY + (this._height / 3) * 3));
		ctx.lineTo((this._posX + (this._width / 5) * 5), (this._posY + (this._height / 3) * 2));
		ctx.lineTo((this._posX + (this._width / 5) * 6), (this._posY + (this._height / 3) * 1.5));
				
		// Upper part
		ctx.moveTo((this._posX + (this._width / 5) * 0), (this._posY + (this._height / 3) * 1.5));
		ctx.lineTo((this._posX + (this._width / 5) * 1), (this._posY + (this._height / 3) * 1));
		ctx.lineTo((this._posX + (this._width / 5) * 2), (this._posY + (this._height / 3) * 0));
		ctx.lineTo((this._posX + (this._width / 5) * 3), (this._posY + (this._height / 3) * 1));
		ctx.lineTo((this._posX + (this._width / 5) * 4), (this._posY + (this._height / 3) * 0));
		ctx.lineTo((this._posX + (this._width / 5) * 5), (this._posY + (this._height / 3) * 1));
		ctx.lineTo((this._posX + (this._width / 5) * 6), (this._posY + (this._height / 3) * 1.5));
		
		ctx.fill();
		
		ctx.fillStyle=this._borderColor;
		
		ctx.beginPath();
		ctx.arc((this._posX + (this._width / 5) * 2), (this._posY + (this._height / 3) * 1.5), 3, 0, (2 * Math.PI));
		ctx.fill();
		ctx.beginPath();
		ctx.arc((this._posX + (this._width / 5) * 4), (this._posY + (this._height / 3) * 1.5), 3, 0, (2 * Math.PI));
		ctx.fill();
	}
	
	this.DrawDying = function (ctx) {
		ctx.beginPath();
		ctx.strokeStyle = this._color;
		ctx.strokeRect(this._posX, this._posY, this._width, this._height);
		ctx.stroke();
	}
	
	this.CausesGameOver = function () {
		return this._causeGameOver;
	}
}