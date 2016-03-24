function Stars() {
	
	this._staticStars = [];
	this._backGroundColor = "black";
	this._movingStars = [];
	this._planets = [];
	this._maxX;
	this._maxY;
	
	this.Init = function (staticStarCount, movingStarCount, planetCount, backgroundColor, maxX, maxY) {
		var i;
		
		this._maxX = maxX;
		this._maxY = maxY;
		
		this._backGroundColor = backgroundColor;
		i = 0;
		for (; i < staticStarCount; i = i + 1) {
			this._staticStars.push({
				x: Math.floor(Math.random()*maxX),
				y: Math.floor(Math.random()*maxY),
				color: "#fff",
				radius: Math.floor(Math.random()*2) + 1
			});
		}
		
		// i = 0;
		// for (; i < movingStarCount; i = i + 1) {
			// this._movingStars.push({
				// x: Math.floor(Math.random()*maxX),
				// y: Math.floor(Math.random()*maxY),
				// color: "#fff",
				// radius: 2,
				// direction
			// });
		// }
		
		// i = 0;
		// for (; i < movingStarCount; i = i + 1) {
			// this._movingStars.push({
				// x: Math.floor(Math.random()*maxX),
				// y: Math.floor(Math.random()*maxY),
				// color: "#fff",
				// radius: 2
			// });
		// }
	}

	this.Update = function () {
		// Update moving stars
	}
	
	this.Draw = function (ctx) {
		var i;
		
		// Draw background
		ctx.fillStyle = this._backGroundColor;
		ctx.beginPath();
		ctx.rect(0, 0, this._maxX, this._maxY);
		ctx.closePath();
		ctx.fill();
		
		// Draw static stars
		i = 0;
		for (; i < this._staticStars.length; i = i + 1) {
			ctx.fillStyle = this._staticStars[i].color;	
			ctx.beginPath();
			ctx.arc(this._staticStars[i].x, this._staticStars[i].y, this._staticStars[i].radius, 0, (2 * Math.PI));
			ctx.closePath();
			ctx.fill();
		}
		
		// Draw planets
		
		// Draw moving stars
		
	}
}