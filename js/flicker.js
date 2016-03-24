function Flicker() {
		
	this._flickerColors = [];
	this._flickerGradients = [];
	this._flickerObjects = [];
	this._flickerMinY;
	this._flickerMaxY;
	this._flickerHeight;
	this._maxX;
	this._maxY;
	this._currentColorIndex = 0;
	
	this.Init = function (speed, colors, gradients, height, maxX, maxY) {
		this._flickerColors = colors;
		this._flickerGradients = gradients;
		this._flickerSpeed = speed;
		this._flickerHeight =  height;
		this._maxX = maxX;
		this._maxY = maxY;
		this._flickerMinY = 0 - height;
		this._flickerMaxY = maxY + height;
	
		var i = 0;
		for (; i < colors.length; i = i + 1) {
			this._flickerObjects.push({
				x: 0,
				y: this._flickerMinY + (this._flickerHeight * i),
				color: colors[i],
				gradient: !!gradients[i] ? gradients[i] : null
			});
			this._currentColorIndex++;
		}
	}

	this.Update = function () {
		var i = 0,  
			addNeeded = false,
			_this = this;
		
		// Determine if another item can be added
		if (this._flickerObjects.filter(function (e) {
			return e.y < 0;
		}).length == 0) {
			addNeeded = true;
		}
		
		// Remove items out of display
		this._flickerObjects = this._flickerObjects.filter(function (e) {
			return e.y < _this._flickerMaxY;
		});
			
		// Add
		if (addNeeded) {
			this._flickerObjects.push({
				x: 0,
				y: this._flickerMinY,
				color: this._flickerColors[((this._currentColorIndex - 1) % this._flickerColors.length)],
				gradient: !!this._flickerGradients[((this._currentColorIndex - 1) % this._flickerColors.length)] ? this._flickerGradients[((this._currentColorIndex - 1) % this._flickerColors.length)] : null
			});
			this._currentColorIndex++;
		}
				
		// Update
		for (; i < this._flickerObjects.length; i = i + 1) {
			this._flickerObjects[i].y = (this._flickerObjects[i].y + this._flickerSpeed);
		}
	}
	
	this.Draw = function (ctx) {
		var i = 0,
			linGrad;
		for (; i < this._flickerObjects.length; i = i + 1) {
			if (((this._flickerObjects[i].y + this._flickerHeight) > 0) && (this._flickerObjects[i].y < this._maxX)) {
				// Gradient specified? Use it
				if (!!this._flickerObjects[i].gradient) {
					linGrad = ctx.createLinearGradient(0, this._flickerObjects[i].y, 0, (this._flickerObjects[i].y + this._flickerHeight));
					linGrad.addColorStop(0, this._flickerObjects[i].color);
					linGrad.addColorStop(0.5, this._flickerObjects[i].gradient);
					linGrad.addColorStop(1, this._flickerObjects[i].color);
				} else {
					linGrad = null;
				}
								
				ctx.beginPath();
				ctx.fillStyle = !!linGrad ? linGrad : this._flickerObjects[i].color;
				ctx.rect(this._flickerObjects[i].x, this._flickerObjects[i].y, this._maxX, this._flickerHeight);
				ctx.fill();
			}
		}
	}
}