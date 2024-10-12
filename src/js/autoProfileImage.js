function randomColor(){
	var colorBank = [
		'#F44336',
		'#E91E63',
		'#9C27B0',
		'#673AB7',
		'#3f51b5',
		'#2196f3',
		'#03a9f4',
		'#00bcd4',
		'#009688',
		'#4CAF50',
		'#8BC34A',
		'#CDDC39',
		'#FFEB3B',
		'#FFC107',
		'#FF9800',
		'#FF5722',
		'#607D8B',
		'#bbffbb'
	];
	
	return colorBank[Math.floor(Math.random()*colorBank.length)];
}


function autoProfileImage(__char, __fg = '#ffffff', __bg = randomColor(), size = 255){
	var canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	// canvas.style.position = 'absolute';
	// canvas.style.zIndex = '100';
	// canvas.style.borderRadius = '50%';
	// $('#home').append(canvas);
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = __bg;
	ctx.fillRect(0, 0, size, size);
	ctx.translate(size / 2, size / 2);
	// ctx.fillStyle = 'green';
	// ctx.beginPath();
	// ctx.arc(0, 0, 5, 0, 2 * Math.PI);
	// ctx.fill();	
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.font = `${size / 2}px Nunito`;
	ctx.fillStyle = __fg;
	
	ctx.fillText(__char[0], 0, 0);
	
    var dataURL = canvas.toDataURL();

	return dataURL
}