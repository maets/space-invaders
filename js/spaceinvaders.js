
var _game,
	animFrame = window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				null,
	cancelAnimFrame = window.cancelAnimationFrame || 
					  window.mozCancelAnimationFrame,
    powerOn = false;
	
	
				
document.addEventListener('DOMContentLoaded', function () {
	
	var powerButton = document.getElementById('PowerButton'),
		  volumeUpButton = document.getElementById('VolumeUpButton'),
		  volumeDownButton = document.getElementById('VolumeDownButton'),
		  powerLedBackground = document.getElementById('PowerLedBackground');
	
	// Instantiate and start game
	_game = new Game();
	window.addEventListener('keydown', function (e) { 
		_game.KeyDown(e); 
	},true);
	
	
	powerButton.addEventListener("click", function (e) { 
		powerOn = !powerOn;
		
		if (powerOn) {
			_game.Run(animFrame);
		} else {
			_game.PowerOff();
		}
		
		powerLedBackground.style.backgroundColor = powerOn ? "green" : "red";
		
	}, false);
	
});

