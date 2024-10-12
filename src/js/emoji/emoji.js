const reacts_name = ["u2764"]


function unicodeToHcstring(text) {
	let out = ""
	for ( c of text ) {
		let n = c.codePointAt(0)
		if (all_supported_emoji_num.includes(n)) {
			let k = all_supported_emoji[all_supported_emoji_num.indexOf(n)]
			if (k != null) out += ":" + k + "; "
			else out += c
		}
		else {
			out += c
		}
	}
	return out
}


// function encode_emoji_string(str){
// for (var i = 0; i < str.length; i++){
// let C = str[i]
// let U = String.fromCodePoint(C.charCodeAt(0))
// // //console.log(CHAR, U, all_supported_emoji_chars.includes(U))
// //console.log(U)
// }
// }
function parse_emoji_id(str, size = 16){
	if(all_supported_emoji.includes(str)){
		return `<img src="${emoji_img_src(str)}" height="${size}" width="${size}" referrerpolicy="origin-when-cross-origin" oncontextmenu="return false;"/>`
	}
	else {
		if (str[0] == "u") {
			return String.fromCodePoint(parseInt(str.slice(1), 16))
		}
	}
	
	return str
}

function parse_emoji_code(str, size = 16){
	if(all_supported_emoji_code.includes(str)){
		var src = all_supported_emoji[all_supported_emoji_code.indexOf(str)];
		return `<img src="${emoji_img_src(src)}" height="${size}" width="${size}" referrerpolicy="origin-when-cross-origin" oncontextmenu="return false;"/>`
	}
	else return str
}

function emoji_img(name, scale = 40, isMarked = false){
	if (!all_supported_emoji.includes(name)) name = 'u2764'
	
	var icon = new Image();
	icon.src = '/res/emoji/' + name + '.svg';
	icon.height = scale;
	icon.width = scale;
	icon.setAttribute('alt', '#')
	icon.setAttribute('onContextMenu', 'return false;')
	icon.setAttribute('name', name);
	if(isMarked) icon.setAttribute('class', 'icon marked');
	else icon.setAttribute('class', 'icon');
	return icon;
}

function emoji_img_src(name){
	return '/res/emoji/' + name + '.svg';
}

function emoji_selection(callback = function(){}){
	var bg = document.createElement('div');
	bg.setAttribute('class', 'emoji-selection-bg');
	this.main = document.createElement('div');
	this.main.setAttribute('class', 'emoji-selection');
	this.reacts = {};
	for(name in reacts_name){
		this.reacts[reacts_name[name]] = new emoji_img(reacts_name[name], 32)
	}
	for(i in this.reacts){
		var elm = this.reacts[i];
		var ref = this;
		elm.onclick = function(){
			callback(this.getAttribute('name'), this);
			bg.remove();
		};
		ref.main.appendChild(elm);
	}
	bg.appendChild(this.main);
	document.querySelector('body').appendChild(bg);
}

emoji_selection.prototype.markEmojiByName = function(str){
	if(this.reacts[str] != null) this.reacts[str].setAttribute('class', 'icon marked')
}


function emoji_piker(callback = function(){}){
	var bg = document.createElement('div');
	bg.setAttribute('class', 'emoji-piker-bg');
	this.main = document.createElement('div');
	this.main.setAttribute('class', 'emoji-piker');
	this.reacts = {};
	for(name in all_supported_emoji){
		this.reacts[all_supported_emoji[name]] = new emoji_img(all_supported_emoji[name], 25)
	}
	for(i in this.reacts){
		var elm = this.reacts[i];
		var ref = this;
		elm.onclick = function(){
			callback(this.getAttribute('name'), this);
			bg.remove();
		};
		ref.main.appendChild(elm);
	}
	bg.appendChild(this.main);
	document.querySelector('body').appendChild(bg);
}

emoji_piker.prototype.markEmojiByName = function(str){
	if(this.reacts[str] != null) this.reacts[str].setAttribute('class', 'icon marked')
}


function message_hold_menu(callback = function(){}, div_count){
	this.reacts = {};
	this.divs = []
	this.bg = document.createElement('div');
	this.bg.setAttribute('class', 'msg-hold-menu-bg');
	{
		this.main = document.createElement('div');
		this.main.setAttribute('class', 'msg-hold-menu');
		{
			this.top_body = document.createElement('div');
			this.top_body.setAttribute('class', 'top-body')
			for(name in all_supported_emoji){
				this.reacts[all_supported_emoji[name]] = new emoji_img(all_supported_emoji[name], 25)
			}
			for(i in this.reacts){
				var elm = this.reacts[i];
				var ref = this;
				elm.onclick = function(){
					callback(this.getAttribute('name'), this);
					ref.bg.remove();
				};
				this.top_body.appendChild(elm);
			}
			this.main.appendChild(this.top_body)
		}
		{
			this.bottom_body = document.createElement('div');
			this.bottom_body.setAttribute('class', 'bottom-body')
			for(d = 0; d < div_count; d++){
				var div = document.createElement('div')
				div.innerHTML = d
				this.divs.push(div)
				this.bottom_body.appendChild(div)
			}
			this.main.appendChild(this.bottom_body)
		}
		this.bg.appendChild(this.main);
	}
	document.querySelector('body').appendChild(this.bg);
}

message_hold_menu.prototype.markEmojiByName = function(str){
	if(this.reacts[str] != null) this.reacts[str].setAttribute('class', 'icon marked')
}