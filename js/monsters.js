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
		
		var isAnythingHit = false;
		
		// Check if shot within any monster area
		this._monsters = this._monsters.filter(function (e) {
			var returnValue = e.IsHit(shot);
			if (returnValue) {
				_this._dyingMonsters.push(e);
				shot._isActive = false;
				isAnythingHit = true;
			}
			return !returnValue;
		});
		
		return isAnythingHit;
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