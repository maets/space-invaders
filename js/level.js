function Level() {
	this._monsters;
	this._name;
	
	this.Init = function (monsters, name) {
		this._monsters = monsters;
		this._name = name;
	}
	
	this.IsWin = function () {
		return this._monsters.IsWin();
	}
	
	this.CausesGameOver = function () {
		return this._monsters.CausesGameOver();
	}
	
	this.CheckHit = function (shot) {
		return this._monsters.CheckHit(shot);
	}
	
	this.Update = function (maxX, maxY) {
		this._monsters.Update(maxX, maxY);
	}
	
	this.Draw = function (ctx) {
		this._monsters.Draw(ctx);
	}
}