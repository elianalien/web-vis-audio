// basic NOTE
notesBass   = '10143013202140205013101440202021';
notesMelody = '11143313222144225513111444222221';


// all vars
var MAX_PARTICLES = 500,
	MAX_LIFE_SPAN = 100,
	MIN_DENSITY = 15,
	OFFSET_DENSITY= 15,
	_time = 0,
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
	f => Math.sin(f * _time * Math.PI * 2);

oscSawTooth =
	f => (f * _time * 2 + 1 ) % 2 - 1;

oscSquare = 
	f => 1 - (f * _time * 2 & 1) * 2;

oscNoise = 
	f => Math.random() * 2 -1;

// noise
noise = []
newNoise = e => {
	for (var i = 0; i < 8192; i++) {
		noise[i] = Math.random() - .5;
	}
}

newNoise()
onclick = newNoise;


// draw image 
// callback to image onload
_image = new Image();
_image.src = 'alphatest.png';
_image.onload = e => {
	// init Audio Context when Image loaded
	AC = new AudioContext();
	// script processor
	SP = AC.createScriptProcessor(2048, 0, 1); // 1024 buffer = 1024 sample frame
	SP.connect(AC.destination);

	SP.onaudioprocess = render;
}

// rendering each frame
render = f => {
	// audio Data
	audioData = f.outputBuffer.getChannelData(0);
	
	var timeInc = 1 / AC.sampleRate

	_time += audioData.length / AC.sampleRate;

	// print _timer on browser's title 
	document.title = _time;

	for (var i = 0; i < audioData.length; i++){
		_time += timeInc; 		// time in scnd
		beat = _time * 2;	// 120 bpm
		bar = beat / 4;
		pattern = bar / 6;
		note = beat * 4;
		master = Math.min(1, pattern);

		signal = 0;

		// melody 
		if (pattern > 1 ){
			vol = .1;
			env = 1 - note % 2;
			f = notesMelody.charAt(note % notesMelody.length) * 64;
			signal += oscSquare(f) * env * vol;
		}

		// hihat
		vol = .1;
		env = Math.pow(1 - beat % 1, 8);
		signal += oscNoise() * vol * env;

		// cymbal crash 
		vol = .7;
		env = Math.pow(pattern % 1, 4) * .1 + 
			  Math.pow(1 - pattern % 1, 64);
		signal += oscNoise() * vol * env;		

		audioData[i] = signal * master;

	}

	// particle routine 
	particleRoutine();

	c.style.scale = 1 + Math.pow(env + audioData[17], 3);
	// _context.setTransform(1,0,0,1,0,0);
	// _context.globalAlpha = _mouseY * _mouseY;
	// redraw image
	_context.drawImage(_image, _canvasWidth / 2 - _image.width / 2, 0);
	
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
		_lifespan = 0,
		_opacity = 0.5,
		_pvx,
		_pvy;

	update = () => {
		_lifespan++;

		if (_lifespan % 3 === 0) {
			_opacity = 1 - _lifespan / MAX_LIFE_SPAN;
		
		}

		var _posX2 = Math.random() * _canvasWidth
		var _posY2 = Math.random() * _canvasHeight

		// x = A + t * (B - A)
		_posX = _posX + (Math.random() * .005) * (_posX2 - _posX)
		_posY = _posY + (Math.random() * .005) * (_posY2 - _posY)
		

	}

	this.getOpacity = function() { return _opacity;};
	this.getX = function() { return _posX;};
	this.getY = function() { return _posY;};
	this.getLifespan = function() { return _lifespan};
	this.update = update;
}

particleRoutine = () => {
	// add particle if size < max particle
	if (_particles.length < MAX_PARTICLES){
		var part = new Particle();
		_particles.push(part);
	}

	// clear canvas per frame
	_context.clearRect(0, 0, _canvasWidth, _canvasHeight);
	
	
	// check and updates each _time
	for (var i = 0; i < _particles.length; i++) {
		// update per _time
		_particles[i].update();

		// update opacity per frame based on update
		_context.fillStyle = 'rgba(' + Math.random() * 255 + ',' 
									 +  255 + ',' 
									 + Math.random() * 255 + ',' 
									 + _particles[i].getOpacity() + ')';
		_context.fillRect(_particles[i].getX(), _particles[i].getY(), 3, 3);	

		// destroy 
		if (_particles[i].getLifespan()>MAX_LIFE_SPAN){
			_particles.splice(i,1);
		}
	}
}

// program run from here 
init();
