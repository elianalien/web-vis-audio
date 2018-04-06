// basic NOTE
notesBass   = '10143013202140205013101440202021';
notesMelody = '11143313222144225513111444222221';

// basic oscillator 
oscSinus = 
	f => Math.sin(f * time * Math.PI * 2);

oscSawTooth =
	f => (f * time * 2 + 1 ) % 2 - 1;

oscSquare = 
	f => 1 - (f * time * 2 & 1) * 2;

oscNoise = 
	f => Math.random() * 2 -1;


image = new Image();
image.src = 'alphatest.png';
image.onload = e => {
	ctx = c.getContext('2d');
	c.width = width = image.naturalWidth * 2;
	c.height = height = image.naturalHeight * 2;
	ctx.drawImage(image, 225, 0);

	AC = new AudioContext();
	SP = AC.createScriptProcessor(2048, 0, 1);
	SP.connect(AC.destination);
	SP.onaudioprocess = render;

}

render = e => {
	audioData = e.outputBuffer.getChannelData(0);
}


time = 0;
