function Intro() {
	this._sceneNo = 1;
	this._dirY = 5;
	this._frameWidth = 600;
	this._frameHeight = 200;
	this._frameColor = "saddlebrown";
	this._framePosX = 100;
	this._framePosY = -400;
	this._sceneColor = "white";
	this._sceneCount = 2;
	this._introFinished = false;
	this._maxX;
	this._maxY;
	this._waitIndex = 0;
	this._waitIndexMax = 200;
	this._introMusic;
	
	this.Init = function (maxX, maxY) {
		this._maxX = maxX;
		this._maxY = maxY;
		
		this._introMusic = document.querySelector("#AudioIntro");
		this._introMusic.play();
	}
	
	this.Update = function () {
		// Animate scenes
		
		// Let scene stay in the middle for a couple of framerates
		if (this._framePosY == 100 && this._waitIndex < this._waitIndexMax) {
			this._waitIndex++;
		// Switch scene
		} else if (this._framePosY >= 1200) {
			this._sceneNo = this._sceneNo + 1;
			
			// Reset background variables
			this._framePosX = 100;
			this._framePosY = -400;
			this._waitIndex = 0;
		} else {
			this._framePosY = this._framePosY + this._dirY;
		}

		if (this._sceneNo > this._sceneCount) {
			this.EndIntro();
		}

		this._frameIndex++;
	}

	this.AnimateBackground = function (ctx) {
		var tmpLineWidth = ctx.lineWidth;

		// Frame
		ctx.beginPath();		
		ctx.strokeStyle = this._frameColor;
		ctx.fillStyle = this._sceneColor;
		ctx.lineWidth = 25;
		ctx.rect(this._framePosX, this._framePosY, this._frameWidth, this._frameHeight);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		
		ctx.lineWidth = tmpLineWidth;
	}

	this.Scene1 = function (ctx) {
		var text = "Määts presents...";
		ctx.font = '50px Calibri';	

		// Set shadow
		ctx.fillStyle = 'black';
		ctx.fillText(text, (this._framePosX + 122), (this._framePosY + 102));
		
		// Set text
		ctx.fillStyle = 'red';
		ctx.fillText(text, (this._framePosX + 120), (this._framePosY + 100));
	}

	this.Scene2 = function (ctx) {
		ctx.font = '50px Calibri';

		// Set main shadow
		ctx.fillStyle = 'black';
		ctx.fillText('SPÄJS INVÄJDÖRS!', (this._framePosX + 112), (this._framePosY + 102));

		// Set main text
		ctx.fillStyle = 'red';
		ctx.fillText('SPÄJS INVÄJDÖRS!', (this._framePosX + 110), (this._framePosY + 100));

		ctx.font = '25px Calibri';

		// Set secondary shadow #1
		ctx.fillStyle = 'black';
		ctx.fillText('v 0.4.... gött mos i pösen!', (this._framePosX + 111), (this._framePosY + 151));

		// Set secondary text #1
		ctx.fillStyle = 'red';
		ctx.fillText('v 0.4.... gött mos i pösen!', (this._framePosX + 110), (this._framePosY + 150));

		// Set secondary shadow #2
		ctx.fillStyle = 'black';
		ctx.fillText('(in english: nice mash in the bag!)', (this._framePosX + 111), (this._framePosY + 176));

		// Set secondary text #2
		ctx.fillStyle = 'red';
		ctx.fillText('(in english: nice mash in the bag!)', (this._framePosX + 110), (this._framePosY + 175));
	}

	this.Draw = function (ctx) {
		if (!this._introFinished) {
			// Draw scene
			this.AnimateBackground(ctx);
						
			if (this._sceneNo == 1) {
				this.Scene1(ctx);					
			} else if (this._sceneNo == 2) {
				this.Scene2(ctx);
			}
		}
	}
	
	this.EndIntro = function () {
		this._introFinished = true;
		this._introMusic.pause();
		delete this._introMusic;
	}
}
