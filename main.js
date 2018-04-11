// basic NOTE
notesBass   = '10143013202140205013101440202021';
notesMelody = '11143313222144225513111444222221';

// time init 
time = 0;

// all vars
var MAX_PARTICLES = 1000,
	MAX_LIFE_SPAN = 300,
	MIN_DENSITY = 15,
	OFFSET_DENSITY= 15,
	_context,
	_image,
	_mouseX,
	_mouseY,
	_particles, 
	_canvasWidth,
	_canvasHalfWidth,
	_canvasHeight,
	_canvasHalfHeight;

// basic oscillator 
oscSinus = 
	f => Math.sin(f * time * Math.PI * 2);

oscSawTooth =
	f => (f * time * 2 + 1 ) % 2 - 1;

oscSquare = 
	f => 1 - (f * time * 2 & 1) * 2;

oscNoise = 
	f => Math.random() * 2 -1;


// draw image 
// callback to image onload
_image = new Image();
_image.src = 'alphatest.png';
_image.onload = e => {
	// init Audio Context when Image loaded
	AC = new AudioContext();
	// script processor
	SP = AC.createScriptProcessor(1024, 0, 1); // 1024 buffer = 1024 sample frame
	SP.connect(AC.destination);

	SP.onaudioprocess = render;
}

// rendering each frame
render = e => {
	// audio Data
	audioData = e.outputBuffer.getChannelData(0);
	
	// print timer on browser's title 
	time += audioData.length / AC.sampleRate;
	document.title = time;

	// add particle if size < max particle
	if (_particles.length < MAX_PARTICLES){
		var part = new Particle();
		_particles.push(part);
	}

	// clear canvas per frame
	_context.clearRect(0, 0, _canvasWidth, _canvasHeight);
	
	// redraw image
	_context.drawImage(_image, _canvasWidth / 2 - _image.width / 2, 0);
	
	// check and updates each time
	for (var i = 0; i < _particles.length; i++) {
		// update per time
		_particles[i].update();

		// update opacity per frame based on update
		_context.fillStyle = 'rgba(255, 255, 255, ' + _particles[i].getOpacity() + ')';
		_context.fillRect(_particles[i].getX(), _particles[i].getY(), 3, 3);	

		// destroy 
		if (_particles[i].getLifespan()>MAX_LIFE_SPAN){
			_particles.splice(i,1);
		}
	}
}

// init function 
init = f => {
	console.log('init')
	// init particle 
	_particles = [];

	
	// init context 
	_context = c.getContext('2d');

	// init 
	window.addEventListener('resize', onresize);
	window.addEventListener('mousemove', onmousemove);

	// on resize function 
	onresize();

}

onmousemove = e => {
	_mouseX = e.pageX / innerWidth;
	_mouseY = e.pageY / innerHeight;
}

onresize = () => {
	console.log('onresize')
	_canvasWidth = c.offsetWidth;
	_canvasHalfWidth = Math.round(_canvasWidth / 2);
	_canvasHeight= c.offsetHeight; 
	_canvasHalfHeight= Math.round(_canvasHeight / 2);

	c.width = _canvasWidth;
	c.height= _canvasHeight;


	console.log('width: ', _canvasWidth, ' height: ', _canvasHeight);
}

// particles
function Particle() {
	var _this = this,
		_direction = -1 + Math.random() * 10,
		_posX = Math.random() * _canvasWidth,
		_posY = Math.random() * _canvasHeight,
		_lifespan = 0;
		_opacity = 1;

	update = () => {
		_lifespan++;

		if (_lifespan % 3 === 0) {
			_opacity = 1 - _lifespan / MAX_LIFE_SPAN;
		
		}
	}

	this.getOpacity = function() { return _opacity;};
	this.getX = function() { return _posX;};
	this.getY = function() { return _posY;};
	this.getLifespan = function() { return _lifespan};
	this.update = update;
}

// program run from here 
init();
