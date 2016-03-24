function Monster() {
	this._speed;
	this._color;
	this._borderColor;
	this._height;
	this._width;
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
				if (((this._posX + this._dirX + this._width) > maxX) || (this._posX + this._dirX - this._width) < 0) {
					this._moveMode = 2;
				} else {
					this._posX = this._posX + this._dirX;
				}
			} else if (this._moveMode == 2) { // Y position
				if ((this._posY + this._dirY + this._height) > this._maxStepY) {
					this._moveMode = 1;
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

function Monsters() {
	
	this._monsters = [];
	this._dyingMonsters = [];
	this._causeGameOver = false;
	this._monstersPerRow = 8;
	
	this.GenerateMonsters = function (amount, speed, color, borderColor, height, width) {
		var i = 0,
			_monster,
			startPosX,
			startPosY,
			rowIndex = 0,
			spacing = 30;
		
		for (; i < amount; i = i + 1) {
			_monster = new Monster();
			rowIndex = Math.ceil((i + 1) / this._monstersPerRow);
			
			startPosX = ((i % this._monstersPerRow) * (spacing + width)) + spacing;
			startPosY = (spacing * (rowIndex + 1)) + (height * rowIndex);
			_monster.Init(speed, color, borderColor, startPosX, startPosY, height, width);
			this._monsters.push(_monster);
		}
	}
	
	this.Update = function (maxX, maxY) {
		// Move all monsters 1 step
		var i = 0;		
		for (;i < this._monsters.length; i = i + 1) {
			if (this._monsters[i].CausesGameOver())
				this._causeGameOver = true;
			else 
				this._monsters[i].Update(maxX, maxY);
		}
		
		// Animate all dying monsters
		var i = 0;
		for (;i < this._dyingMonsters.length; i = i + 1) {
			this._dyingMonsters[i].Update(maxX, maxY);
		}
		
		this._dyingMonsters = this._dyingMonsters.filter(function (e) {
			return !e.HasExploded();
		});
	}
	
	this.IsWin = function () {
		return this._monsters.length == 0 && this._dyingMonsters.length == 0;
	}
	
	this.CheckHit = function (shot) {
		var _this = this;
		// Check if shot within any monster area
		this._monsters = this._monsters.filter(function (e) {
			var returnValue = e.IsHit(shot);
			if (returnValue) {
				_this._dyingMonsters.push(e);
				shot._isActive = false;
			}
			return !returnValue;
		});
	}
	
	this.Draw = function (ctx) {
		// Draw alive monsters
		var i = 0;
		for (;i < this._monsters.length; i = i + 1) {
			this._monsters[i].Draw(ctx);
		}
		// Draw dying monsters
		var i = 0;
		for (;i < this._dyingMonsters.length; i = i + 1) {
			this._dyingMonsters[i].Draw(ctx);
		}
	}
	
	this.CausesGameOver = function () {
		return this._causeGameOver;
	}
}