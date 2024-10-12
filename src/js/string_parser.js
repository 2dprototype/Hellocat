function pattern(regex, color, _class){
	this.regex = regex;
	this.color = color;
	this.class = _class;
}

var patterns = [
	new pattern(/(\*\_)([^\r\n])+(\_\*)/gm, 'transparent', 'mark-underline'), // hellocat underline text format
	new pattern(/(\/\~)([^\r\n])+(\~\/)/gm, 'transparent', 'mark-italic'), //hellocat italic text format
	new pattern(/(\/\*)([^\r\n])+(\*\/)/gm, 'transparent', 'mark-bold'), // hellocat bold text format
	new pattern(/(\/\-)([^\r\n])+(\-\/)/gm, 'transparent', 'mark-strike'), // hellocat strike text
	new pattern(/@[a-z0-9_-]+/gm, 'transparent', 'mark-userurl'), //hellocat userurl check
	new pattern(/#[a-zA-Z0-9_-]+/gm, 'transparent', 'mark-hashtag'), //hellocat hashtag check
	new pattern(/:[a-zA-Z0-9_-]+/gm, '#ffffff10', 'mark-emoji'), //hellocat emoji check
	new pattern(/(\:)(([u|h])([a-f0-9]){3,7})+(\;)/gm, 'transparent', 'mark-emoji-id'), //emoji id
	new pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$|^(localhost|http):\/\/[^\s/$.?#].[^\s]*$/gm, 'transparent', 'mark-link'),
];


function isYoutubeLink(str) {
	str = str.trim()
	return (/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/).test(str)
}

function extractYtId(url) {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	
	if (match && match[2].length == 11) {
		return match[2];
	} 
	else {
		return 'error';
	}
}

function getYtEmbUrl(url) {
	return "https://www.youtube.com/embed/" + extractYtId(url)
}

function parseHellocatString(__text){
	let  main = document.createElement('div')
	main.setAttribute('class', 'mark-container')
	__text = unicodeToHcstring(__text)
	var text = getArrayOfParsedString(__text || '');
	for(i = 0; i < text.length; i++){
		var className = text[i].class;
		// var data = replace_newline(text[i].data);
		var data = text[i].data	
		if( className == patterns[0].class ||
			className == patterns[1].class ||
			className == patterns[2].class ||
			className == patterns[3].class    ) {
			let span = document.createElement('span')
			span.setAttribute('class', className)
			span.innerText = data.slice(2, data.length - 2)
			main.appendChild(span)
		}
		else if(className == patterns[4].class) {
			let uname = data.slice(1, data.length)
			let span = document.createElement('span')
			span.innerText = data
			main.appendChild(span)
			database.ref('username/' + uname).get().then(function (e){
				if(e.exists()){
					const uid = e.val()
					$(span).replaceWith(function() {
						let text = $(this).text()
						let url = location.origin
						return `<a target="_blank" class="mark-userurl" href="${url}/u/${uid}">${text}</a>`
					})
				} 
			})
		}
		else if(className == patterns[5].class) {
			let span = document.createElement('span')
			span.setAttribute('class', className)
			span.innerText = data
			main.appendChild(span)
		}
		else if(className == patterns[6].class) {
			let span = document.createElement('span')
			span.setAttribute('class', className)
			span.innerHTML = parse_emoji_code(data)
			main.appendChild(span)
		}
		else if(className == patterns[7].class) {
			// console.log(data)
			let span = document.createElement('span')
			span.setAttribute('class', className)
			span.innerHTML = parse_emoji_id(data.slice(1, data.length-1))
			main.appendChild(span)
		}
		else if(className == patterns[8].class) {
			let a = document.createElement('a')
			a.setAttribute('class', className)
			a.setAttribute('href', data)
			a.setAttribute('target', '_blank')
			a.innerText = data
			main.appendChild(a)
		}
		else {
			let span = document.createElement('span')
			span.innerText = data
			main.appendChild(span)
		}
	}
	return main
}

function getArrayOfPatternRange(text){
	var __arr = [];
	var arr = getArrayOfRange(text);
	for(m = 0; m < arr.length; m++){
		var obj = {
			start : arr[m][0],
			end : arr[m][1],
			color : arr[m][2],
			class : arr[m][3]
		}
		__arr.push(obj);
	}
	return __arr
}


function getArrayOfRange(text){
	var __arr = [];
	for(i = 0; i < patterns.length; i++){
		var arr = [];
		var reg = patterns[i].regex;
		var color = patterns[i].color;
		var _class = patterns[i].class;
		while ((match = reg.exec(text)) != null) {
			var x = [match.index, match.index + match[0].length, color, _class]
			arr.push(x);
		}
		__arr.push(...arr);
	}
	return sortArrayOfRange(__arr)
}

function sortArrayOfRange(a){
	
	var arr = [];
	
	a.sort(function(keyA, keyB) {
		if (keyA[0] < keyB[0]) return -1;
		if (keyA[0] > keyB[0]) return 1;
		return 0;
	});
	
	for(i = 0; i < a.length; i++){
		if(a[i + 1] !== undefined){
			var x_0 = a[i][0];
			var x_1 = a[i][1];
			var y_0 = a[i + 1][0];
			var y_1 = a[i + 1][1];
			if(x_0 == y_0 || x_1 == y_1){
				//don't push same rannges
			}
			else if(x_0 < x_1 && x_1 < y_0 && y_0 < y_1){
				arr.push(a[i]);
			}
			else{
				//push nothing
			}
		}
		else{
			arr.push(a[i]);
		}
	}
	
	return arr
}


function getArrayOfParsedString(text){
	var __arr = [];
	var arr = getArrayOfRange(text);
	if(arr.length > 0){
		__arr.push({
			data : text.slice(0, arr[0][0]),
			class : ''
		});
		for(k = 0; k < arr.length - 1; k++){
			__arr.push({
				data : text.slice(arr[k][0], arr[k][1]),
				class :
				arr[k][3]
			});
			__arr.push({
				data : text.slice(arr[k][1], arr[k + 1][0]),
				class : ''
			});
		}
		__arr.push({
			data : text.slice(arr[arr.length - 1][0], arr[arr.length - 1][1]),
			class : arr[arr.length - 1][3]
		});
		__arr.push({
			data : text.slice(arr[arr.length - 1][1], text.length),
			class : ''
		});
	}
	else{
		__arr.push({
			data : text,
			class : ''
		});
	}
	return __arr
}


function parseStyleSheet(str) {
	str = str.split("\n")[0]
	if (str.slice(0, 9) == "@hc-style") {
		let obj = {}
		str = str.slice(9).trim()
		let arr = str.split(";")
		for (a of arr) {
			let kv = a.split("=")
			if (kv.length == 2) obj[kv[0].trim()] = kv[1].trim()
		}
		return obj
	}
	else {
		return null
	}
}