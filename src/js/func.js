function replace_newline(str){
	return (str || '').replace(/(?:\r\n|\r|\n)/g, '<br>')
}

function replace_tabs(str){
	return (str || '').replace(/(?:\t)/g, '   ')
}

function checkName(first, last){
	if( (first.length <= 0 || last.length <= 0) || (first.length >= 24 || last.length >= 24) ){
		alert('Invalid Names');
		return false
	}
	else return true
}

function insertStringAtIndex(originalString, stringToInsert, index) {
    if (index > originalString.length) {
        return originalString + stringToInsert;
	}
    return originalString.substring(0, index) + stringToInsert + originalString.substring(index);
}

function autoUserID(first, last){
	return makeValidUserURL(`${first}_${last}_${randomString(4)}`.toLocaleLowerCase().replace(' ', ''));
}

function makeValidUserURL(url){
	var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+_-';
	
	var res = '';
	for(i = 0; i < url.length; i++){
		for(j = 0; j < str.length; j++){
			if(str[j] == url[i]) res += url[i];
		}
	}
	
	return res.toLowerCase();
}

function validateUserURL(url, callback_if, callback_else){
	if(url.length == 0){
		return false
	}
	else if(url == makeValidUserURL(url)){
		if(callback_if != undefined) callback_if();
		return true
	}
	else{
		if(callback_else != undefined) callback_else();
		return false
	}
}


function validateEmail(email, callback_if, callback_else) {
    const regex_pattern =      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (regex_pattern.test(email)) {
		if(callback_if != undefined) callback_if();
        return true
	}
    else {
		if(callback_else != undefined) callback_else();
        return false
	}
}

function checkDateOfBirth(date){
	var age = getAge(date);
	if(age == 0 || age < 0 || age > 100 || isNaN(age)){ 
		alert("Unreal or Invalid dates are not allowed.");
		return false
	}
	else return true
}

function getAge(dateString) {
	var ageInMilliseconds = new Date() - new Date(dateString);
	return Math.floor(ageInMilliseconds/1000/60/60/24/365);
}

function formatNumber(num) {
	if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
	}
	if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
	}
	if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	}
	return num;
}

function formatTime(date) {
	date = new Date(date)
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}


function formatTimestamp(timestamp){
	var format = { 
		weekday : "long", 
		year : "numeric", 
		month : "short", 
		day : "numeric",
		minute : "numeric",
		hour : "numeric"
	}
	return new Date(timestamp).toLocaleDateString('en-us', format) 
}


function formatDate(timestamp){
	var format = { 
		year : "numeric", 
		month : "long", 
		day : "numeric"
	}
	return new Date(timestamp).toLocaleDateString('en-us', format) 
}

function formatName(_name0 = '', _name1 = ''){
	var name0 = '';
	var name1 = '';
	if(typeof name0 == 'string') name0 = _name0.trim();
	if(typeof name1 == 'string') name1 = _name1.trim();
	if(name1.length == 0) return name0
	else if(name0.length == 0) return name1
	else return name0 + ' ' + name1
}

function getTimeDiffAndPrettyText(_oDatePublished) {
	var oDatePublished = new Date(_oDatePublished);
	// CREDITS : https://stackoverflow.com/questions/1787939/check-time-difference-in-javascript
	var oResult = {};
	var oToday = new Date();
	var nDiff = oToday.getTime() - oDatePublished.getTime();
	// Get diff in days
	oResult.days = Math.floor(nDiff / 1000 / 60 / 60 / 24);
	nDiff -= oResult.days * 1000 * 60 * 60 * 24;
	// Get diff in hours
	oResult.hours = Math.floor(nDiff / 1000 / 60 / 60);
	nDiff -= oResult.hours * 1000 * 60 * 60;
	// Get diff in minutes
	oResult.minutes = Math.floor(nDiff / 1000 / 60);
	nDiff -= oResult.minutes * 1000 * 60;
	// Get diff in seconds
	oResult.seconds = Math.floor(nDiff / 1000);
	// Render the diffs into friendly duration string
	// Days
	var sDays = '00';
	if (oResult.days > 0) {
		sDays = String(oResult.days);
	}
	if (sDays.length === 1) {
		sDays = '0' + sDays;
	}
	// Format Hours
	var sHour = '00';
	if (oResult.hours > 0) {
		sHour = String(oResult.hours);
	}
	if (sHour.length === 1) {
		sHour = '0' + sHour;
	}
	//  Format Minutes
	var sMins = '00';
	if (oResult.minutes > 0) {
		sMins = String(oResult.minutes);
	}
	if (sMins.length === 1) {
		sMins = '0' + sMins;
	}
	//  Format Seconds
	var sSecs = '00';
	if (oResult.seconds > 0) {
		sSecs = String(oResult.seconds);
	}
	if (sSecs.length === 1) {
		sSecs = '0' + sSecs;
	}
	//  Set Duration
	var sDuration = sDays + ':' + sHour + ':' + sMins + ':' + sSecs;
	oResult.duration = sDuration;
	// Set friendly text for printing
	if(oResult.days === 0) {
		if(oResult.hours === 0) {
			if(oResult.minutes === 0) {
				var sSecHolder = oResult.seconds > 1 ? 'Seconds' : 'Second';
				oResult.friendlyNiceText = oResult.seconds + ' ' + sSecHolder + ' ago';
			} 
			else { 
				var sMinutesHolder = oResult.minutes > 1 ? 'Minutes' : 'Minute';
				oResult.friendlyNiceText = oResult.minutes + ' ' + sMinutesHolder + ' ago';
			}
		} 
		else {
			var sHourHolder = oResult.hours > 1 ? 'Hours' : 'Hour';
			oResult.friendlyNiceText = oResult.hours + ' ' + sHourHolder + ' ago';
		}
	} 
	else { 
		var sDayHolder = oResult.days > 1 ? 'Days' : 'Day';
		oResult.friendlyNiceText = oResult.days + ' ' + sDayHolder + ' ago';
	}
	return oResult;
}

function timestampToDate(timestamp) {
    var d = new Date(timestamp),
	month = '' + (d.getMonth() + 1),
	day = '' + d.getDate(),
	year = d.getFullYear();
	
    if (month.length < 2) 
	month = '0' + month;
    if (day.length < 2) 
	day = '0' + day;
	
    return [year, month, day].join('-');
}


function minimize_text(str, range){
	var res = '';
	if(range >= str.length) res = str;
	else res = str.slice(0, range);
	
	res += '...';
	return res
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

function is_image_type(t){
	if(t == 'image/bmp') return true
	else if(t == 'image/gif') return true
	else if(t == 'image/vnd.microsoft.icon') return true
	else if(t == 'image/x-icon') return true
	else if(t == 'image/jpeg') return true
	else if(t == 'image/png') return true
	else if(t == 'image/svg+xml') return true
	else if(t == 'image/tiff') return true
	else if(t == 'image/webp') return true
	else return false
}

function is_audio_type(t){
	if(t == 'audio/wav') return true
	else if(t == 'audio/webp') return true
	else if(t == 'audio/ogg') return true
	else if(t == 'audio/opus') return true
	else if(t == 'audio/mpeg') return true
	else if(t == 'audio/aac') return true
	else return false
}

function is_video_type(t){
	if(t == 'video/x-msvideo') return true
	else if(t == 'video/mp4') return true
	else if(t == 'video/mpeg') return true
	else if(t == 'video/ogg') return true
	else if(t == 'video/mp2t') return true
	else if(t == 'video/webm') return true
	else if(t == 'video/3gpp') return true
	else if(t == 'video/3gpp2') return true
	else return false
}


function fetch_as_text(url, callback = function(){}){
	fetch(url).then(function(e){
		e.text().then(function(f){
			callback(f)
		})
	})
}

function fetch_as_blob(url, callback = function(){}){
	fetch(url).then(function(e){
		e.blob().then(function(f){
			callback(f)
		})
	})
}


function save_file(url, filename = null){
	fetch(url).then(function(e){
		e.blob().then(function(f){
			saveAs(f, filename)
		})
	})
}

function render_3d(src, callback) {
	let height = 500
	let width = 500
	// Create a scene
	var scene = new THREE.Scene();
	// Create a camera
	var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	camera.position.z = 5;
	// Create a renderer with lower quality settings
	var renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
	renderer.setSize(width, height);
	
	// Add a directional light
	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);
	
	// Load the OBJ model
	var loader = new THREE.OBJLoader();
	loader.load(
		src,
		function (object) {
			scene.add(object);
			callback(renderer.domElement.toDataURL())
		},
		function (xhr) {},
		function (error) { callback(null) }
	);
	
}

function formatTS(t) {
	const date = new Date(t)
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	let hours = date.getHours();
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const period = hours >= 12 ? 'PM' : 'AM';
	
	// Convert hours to 12-hour format
	if (hours > 12) {
		hours -= 12;
		} else if (hours === 0) {
		hours = 12;
	}
	
	return `${day}/${month}/${year} ${hours}:${minutes} ${period}`;
}