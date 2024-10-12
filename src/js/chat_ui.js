function chat_ui(){
	this.element = $('#chat-ui')[0];
	this.reply_mode = false;
	this.lastAppendDate = null;
	this.reply_id = null;
	this.latestDoc = null
	this.limit = 18;
	this.emoji_size = 40;
	this.user_emoji = 'u2764';
	this.chat_title = null
	this.unseen_msgs = []
	this.WebImageEditor = new WebImageEditor();
	this.header = $(this.element).find('.header')[0];
	this.body = $(this.element).find('.body')[0];
	this.footer = $(this.element).find('.footer')[0];
	this._body = {
		content_head : $(this.body).find('.content-head')[0],
		content_body : $(this.body).find('.content-body')[0],
		load_more : $(this.body).find('.load-more')[0]
	}
	this._header = {
		username : $(this.header).find('.username')[0],
		status : $(this.header).find('.status')[0],
		state : $(this.header).find('.state')[0],
		profile_pic : $(this.header).find('.profile-pic')[0],
		close_btn : $(this.header).find('.close-btn')[0]
	}
	this._footer = {
		buttons : $(this.footer).find('button'),
		// inputs : $(this.footer).find('input'),
		textareas : $(this.footer).find('textarea'),
		icons : $(this.footer).find('.icon'),
		more_div : $('#msg-more-option')
	}
	this.fid_typing = $('#fid-typing')
	this.sidenav =  $(this.element).find('.side-nav')[0];
	this.closenav = $(this.sidenav).find('.nav-close-btn')[0];
	this.nav_a = $(this.sidenav).find('.a');
	this._nav = {
		profile_pic : $(this.sidenav).find('.nav-profile-pic')[0],
		state : $(this.sidenav).find('.nav-state')[0],
		title : $(this.sidenav).find('.nav-title')[0],
		sub_title : $(this.sidenav).find('.nav-sub-title')[0],
		info : {
			active : $(this.sidenav).find('.n-info-active')[0],
			device : $(this.sidenav).find('.n-info-device')[0],
			country : $(this.sidenav).find('.n-info-country')[0],
			ip : $(this.sidenav).find('.n-info-ip')[0],
		}
	}
	this.cid = null;
	this.fid = null;
	
	this.codeWrite = $("#chat-code-write")[0]
	this._codeWrite = {
		buttons : $(this.codeWrite).find("button"),
		select : $(this.codeWrite).find("select")[0],
		textarea : $(this.codeWrite).find("textarea")[0]
	}
	
	this._audios = []
	
	this.last_appened_msg_id = null
	this.last_appened_msg_ty = null
}

chat_ui.prototype.hide = function(dealy){
	$(this.element).hide(dealy);
}

chat_ui.prototype.show = function(dealy){
	$(this.element).show(dealy);
}


chat_ui.prototype.replaceSelectedText = function(__start = '', __end = ''){
	var textarea = this._footer.textareas[0]
	var value = textarea.value
	var len = value.length;
	var start = textarea.selectionStart;
	var end = textarea.selectionEnd;
	var sel = value.substring(start, end);
	
	// This is the selected text and alert it
	//console.log(sel)
	
	var replace = __start + sel + __end;
	
	// Here we are replacing the selected text with this one
	textarea.value =  value.substring(0, start) + replace + value.substring(end, len);	
	textarea.setSelectionRange(start, start + replace.length)
}

chat_ui.prototype.make_event_text = async function(event, uid, fid, val){
	//console.log(val)
	let u_data = await database.ref('users/' + uid).get()
	let f_data = await database.ref('users/' + fid).get()
	let u_name = formatName(...u_data.val().name)
	let f_name = formatName(...f_data.val().name)
	
	let u_val, f_val
	if(uid == auth.getUid()) {
		u_val = u_data.val()
		f_val = f_data.val()
	}
	else {
		u_val = f_data.val()
		f_val = u_data.val()
	}
	
	let __f_name = formatName(...f_val.name)
	
	let f_pic = f_val.profile_picture
	
	if(event == 'chat-started'){
		// let el = $(`
		// <div>
		// <div style="display: flex; flex-direction: column; align-items: center;margin: 10px;">
		// <img style="border-radius: 50px;" src="${f_pic}" height="60" width="60">
		// <h4 style="margin: 10px 0px 5px 0px;">${__f_name}</h4>
		// <h5 style="margin:0px;">@${f_val.username}</h5>
		// <h4>
		// <span style="font-weight: bold;">${u_name}</span> has started a conversation with <span style="font-weight: bold;">${f_name}</span>
		// </h4>
		// <span>${formatTimestamp(val.timestamp)}</span>
		// </div>
		// </div>
		// `)
		// return el[0]
		
		var node_1 = document.createElement('DIV');
		
		var node_2 = document.createElement('DIV');
		node_2.setAttribute('style', 'display: flex; flex-direction: column; align-items: center;margin: 10px;margin-bottom:0;');
		node_1.appendChild(node_2);
		
		var node_3 = document.createElement('IMG');
		node_3.setAttribute('style', 'border-radius: 50px;');
		node_3.src = f_pic
		node_3.setAttribute('height', '60');
		node_3.setAttribute('width', '60');
		node_2.appendChild(node_3);
		
		var node_4 = document.createElement('H4');
		node_4.setAttribute('style', 'margin: 10px 0px 5px 0px;');
		node_4.innerText = __f_name
		node_2.appendChild(node_4);
		
		var node_5 = document.createElement('H5');
		node_5.setAttribute('style', 'margin:0px;');
		node_5.innerText = '@' + f_val.username
		node_2.appendChild(node_5);
		
		var node_6 = document.createElement('H4');
		node_2.appendChild(node_6);
		node_6.style.textAlign = 'center'
		node_6.style.marginBottom = '0';
		
		var node_7 = document.createElement('SPAN');
		node_7.setAttribute('style', 'font-weight: bold;');
		node_7.innerText = u_name
		node_6.appendChild(node_7);
		
		var node_7i = document.createElement('SPAN');
		node_7i.innerText = ' has started a conversation with '
		node_7i.style.fontWeight= 'normal'
		node_6.appendChild(node_7i);
		
		var node_8 = document.createElement('SPAN');
		node_8.setAttribute('style', 'font-weight: bold;');
		node_8.innerText = f_name
		node_6.appendChild(node_8);
		
		// var node_9 = document.createElement('SPAN');
		// node_9.innerText = formatTS(val.timestamp)
		// node_2.appendChild(node_9);
		
		return node_1
		
	}
}

chat_ui.prototype.new_event = function(m_key, m_val){
	let div = document.createElement('div')
	div.setAttribute('id', m_key)
	div.setAttribute('class', 'evnt')
	// div.innerHTML = val.eventType + ' by ' + val.send_from
	this.make_event_text(m_val.eventType, m_val.send_from, m_val.send_to, m_val).then(function(e){
		$(e).css('display: flex')
		$(e).css('justify-content: center')
		div.appendChild(e)
	})
	return div
}

chat_ui.prototype.new_msg = function(m_key, val, attr){
	var _type = val.type; 
	var _data = val.data;
	var _timestamp0 = val.timestamp;
	var _timestamp1 = val.seenByReceiverAt;
	var _isSeen = val.isSeenByReceiver;
	var ref = this;
	
	var bg = document.createElement('div');
	
	// let d = formatDate(_timestamp0)
	
	// if (ref.lastAppendDate != d) {
	// ref.lastAppendDate = formatTimestamp(val.timestamp)
	// let elm = document.createElement("div")
	// elm.setAttribute('class', 'evnt')
	// elm.innerText = ref.lastAppendDate
	// $(elm).insertAfter(bg);
	// }
	
	bg.setAttribute('id', m_key);
	if(attr == 'send') {
		bg.setAttribute('class', 'msg msg-send');
		this.last_appened_msg_ty = 'send'
	}
	else if(attr == 'receive') {
		bg.setAttribute('class', 'msg msg-receive');
		let img = new Image()
		img.setAttribute("class", "profile-pic")
		img.width = 25
		img.height = 25
		img.src = ref._header.profile_pic.src
		bg.appendChild(img)
		if (this.last_appened_msg_ty == 'receive') $("#" + this.last_appened_msg_id).find(".profile-pic").css("opacity", "0")
		this.last_appened_msg_ty = 'receive'
	}
	
	this.last_appened_msg_id = m_key
	
	{
		var content = document.createElement('div');
		content.setAttribute('class', 'content');
		const body = document.createElement('div');
		const footer = document.createElement('div');
		
		
		
		if(val.reply_of && !val.removed){
			const header = document.createElement('div');
			header.setAttribute('class', '_header')
			{
				let reply_head = document.createElement('div');
				reply_head.setAttribute('class', 'reply-head')
				{
					let title = document.createElement('span')
					title.innerText = 'Reply'
					reply_head.appendChild(title)
				}
				{
					var img = new Image()
					img.setAttribute('class', 'icon')
					// if(val.send_from == auth.getUid()) img.src = '/res/icon/fill/arrow_forward_ios.svg'
					// else img.src = 'res/icon/fill/arrow_back_ios.svg'
					img.src = '/res/icon/fill/reply.svg'
					img.height = 20;
					img.width = 20;
					img.onload = function(){
						SVGInject(this)
					}
					reply_head.appendChild(img)
				}
				header.appendChild(reply_head);
			}
			{
				let reply_body = document.createElement('div');
				reply_body.setAttribute('class', 'reply-body')
				// $('#' + val.reply_of).find('._body').clone().appendTo(reply_body);
				const eid = '#' + val.reply_of + '_body';
				let elm = $(eid);
				if(elm.length > 0){
					elm.clone().appendTo(reply_body);
				}
				else {
					database.ref('chats_data/' + ref.cid + '/messages/' + val.reply_of).get().then(function(e){
						const msg = ref.new_msg(val.reply_of, e.val(), 'send')
						const msg_body = $(msg).find('._body')[0];
						$(msg_body).clone().appendTo(reply_body);
						// reply_body.appendChild(msg_body)
					})
				}
				header.appendChild(reply_body);
			}
			content.appendChild(header);
		}
		
		
		$(footer).hide();
		{
			body.setAttribute('class', '_body');
			body.setAttribute('id', m_key + '_body');
			if(!val.removed) {
				var msg_content = document.createElement('div');
				msg_content.setAttribute('class', 'msg-content');
				let _style = val.style
				if (typeof _style == 'object') {
					for (k in _style) msg_content.style[k] = _style[k]
				}
				if(_type == 'text'){
					if(isYoutubeLink(_data)) {
						var id = getYtEmbUrl(_data)
						msg_content.appendChild(parseHellocatString(_data))
						msg_content.appendChild($(`<iframe src="${id}"></iframe>`)[0])
					} 
					else {
						msg_content.appendChild(parseHellocatString(_data))
					}
				}
				else if(_type == 'code') {
					let langs = hljs.listLanguages()
					let lang = val.lang
					if (lang == "katex") {
						$(msg_content).append(katex.renderToString(_data, {
							throwOnError : false,
							leqno : false,
							strict: false,
							macros: {
								"\\f": "#1f(#2)"
							}
						}))
					}
					else if (langs.includes(lang)) {
						let h = hljs.highlight(_data, {language: lang})
						$(ref.body).html()
						$(msg_content).append(`<code style="font-size: 12px; tab-size: 12px;">${h.value}</code>`)
					}
					else {
						// $(msg_content).append(`<code style="font-size: 12px; tab-size: 12px;">${_data}</code>`)
						let d = document.createElement("code")
						d.style.fontSize = "12px"
						d.style.tabSize = "12px"
						d.innerText = _data
						$(msg_content).append(d)
					}
				}
				else if(_type == 'emoji'){
					let size = val.size
					if (!(size >= 18 && size <= 255)) size = 18;
					msg_content.appendChild(new emoji_img(val.emoji, size))
					// msg_content.style.background =  'none'
				}
				else if(_type == 'file'){
					if(is_image_type(val.filetype)){
						var img = new Image();
						img.setAttribute('class', 'image-content')
						img.setAttribute('onContextMenu', 'return false;')
						img.src = val.url;
						// img.onerror = function(){
						// //console.log(val.filetype + ' has broken .img')
						// }
						// img.onload = function(){
						// // if((ref.body.scrollTop + ref.body.offsetHeight) == ref.body.scrollHeight) {
						// // ref.scroll_bottom()
						// // }
						// }
						msg_content.appendChild(img);
					}
					else if(is_audio_type(val.filetype)){
						// var elm = ``
						// var sound = document.createElement('audio');
						// sound.setAttribute('class', 'audio-content')
						// sound.controls = 'controls';
						// sound.src = val.url;
						// sound.type = val.filetype;
						let ap = new AudioPlayer(val.url, function(id){
							for (au of ref._audios) {
								if (au.id != id) au.pause()
							}
						})
						ref._audios.push(ap)
						msg_content.appendChild(ap.body);
					}
					else if(is_video_type(val.filetype)){
						var video_elm = document.createElement("video");
						video_elm.setAttribute("src", val.url);
						video_elm.setAttribute("class", "video-content");
						// video_elm.setAttribute("width", "320");
						// video_elm.setAttribute("height", "240");
						video_elm.setAttribute("controls", "controls");
						msg_content.appendChild(video_elm);
					}
					else {
						// <div class="download-btn" onclick="save_file('${val.url}', '${val.filename}')">Download</div>
						var div = document.createElement('div');
						div.setAttribute('class', 'file-content')
						div.innerHTML = `
						<div class="file-name">
						<img src="${mime_filetype_svg_src(val.filetype, val.ext)}" height="20" width="20"/>
						<a class="link" href="${val.url}" downlaod>${val.filename || 'Get File URL'}</a>
						</div>
						<div class="btn">
						<div class="download-btn" onclick="save_file('${val.url}', '${val.filename}')">Download</div>
						<div onclick="view_file('${val.url}', '${val.filetype}', '${val.ext}')" class="view-btn">View</div>
						</div>
						`
						msg_content.appendChild(div);
					}
				}
				body.appendChild(msg_content)
			}
			else {
				var msg_content = document.createElement('div');
				msg_content.setAttribute('class', 'msg-content removed-msg');
				msg_content.innerText = 'Message Removed.'
				body.appendChild(msg_content)
			}
			$(body).click(function(){
				let hidden = $(footer).is(":hidden");
				$('._footer').hide('fast');
				if(hidden) $(footer).show('fast');
				else $(footer).hide('fast');
			});
			body.setAttribute('data-long-press-delay', '250');
			body.addEventListener('long-press', function(){
				var menu = new message_hold_menu(function(react_type){
					if(val.reacts != null){
						if(val.reacts[auth.getUid()] != null){
							if(val.reacts[auth.getUid()].type == react_type){
								unreactMsg(auth.getUid(), ref.cid, m_key);
							}
							else reactMsg(auth.getUid(), ref.cid, m_key, react_type);
						}
						else reactMsg(auth.getUid(), ref.cid, m_key, react_type);
					}
					else reactMsg(auth.getUid(), ref.cid, m_key, react_type);
				}, 7)
				if(val.reacts != null){
					if(val.reacts[auth.getUid()] != null){
						var old_type = val.reacts[auth.getUid()].type;
						menu.markEmojiByName(old_type)
					}
				}
				menu.divs[0].innerText = 'Copy Text'
				menu.divs[1].innerText = 'Copy Link'
				menu.divs[2].innerText = 'Download'
				menu.divs[3].innerText = 'View File'
				menu.divs[4].innerText = 'Remove'
				menu.divs[4].style.color = '#ff6c61'
				menu.divs[5].innerText = 'Reply'
				menu.divs[5].style.color = 'rgb(97 124 255)'
				menu.divs[6].innerText = 'Close'
				if(val.removed) {
					$(menu.divs[0]).hide()
					$(menu.divs[1]).hide()
					$(menu.divs[2]).hide()
					$(menu.divs[3]).hide()
					$(menu.divs[4]).hide()
					$(menu.divs[5]).hide()
				}
				else {
					$(menu.divs[5]).click(function(){
						ref.reply_mode = true;
						ref.reply_id = m_key;
						$(ref._footer.buttons[8]).show()
						menu.bg.remove()
					})
				}
				if(val.send_from == auth.getUid()) {
					//remove
					$(menu.divs[4]).click(function(){
						var ask = confirm(`Do you want to remove this message?`);
						if(ask) removeMsg(ref.cid, m_key, val.data || val.url)
						menu.bg.remove()
					})
				}
				else {
					$(menu.divs[4]).hide()
				}
				if(val.type == 'file'){
					$(menu.divs[0]).hide()
					//copy text
					$(menu.divs[1]).click(function(){
					    ClipboardJS.copy(val.url)
						menu.bg.remove()
					})
					//downlaod
					$(menu.divs[2]).click(function(){
						save_file(val.url, val.filename)
						menu.bg.remove()
					})
					//view
					$(menu.divs[3]).click(function(){
						view_file(val.url, val.filetype, val.ext)
						menu.bg.remove()
					})
				}
				else if (val.type == 'text') {
					$(menu.divs[3]).hide()
					$(menu.divs[2]).hide()
					$(menu.divs[1]).hide()
					//copy text
					$(menu.divs[0]).click(function(){
					    // ClipboardJS.copy(body.innerText)
					    ClipboardJS.copy(val.data)
						menu.bg.remove()
					})
					} else {
					$(menu.divs[3]).hide()
					$(menu.divs[2]).hide()
					$(menu.divs[1]).hide()
					$(menu.divs[0]).hide()
				}
				//close
				$(menu.divs[6]).click(function(){
					menu.bg.remove()
				})
			})
			content.appendChild(body);
		}
		if(_isSeen && attr == 'send'){
			var seen_icon = document.createElement('div');
			seen_icon.setAttribute('class', 'seen-icon');
			seen_icon.innerHTML = `<span>seen</span>`
			content.appendChild(seen_icon)
		}
		if(val.reacts != null){
			var emoji_container = document.createElement('div');
			emoji_container.setAttribute('class', 'emoji-container');
			for(key in val.reacts){
				var react = val.reacts[key];
				var emoji = new emoji_img(react.type, 12);
				emoji_container.appendChild(emoji);
			}
			body.appendChild(emoji_container);
		}
		{
			footer.setAttribute('class', '_footer');
			footer.setAttribute('data-long-press-delay', '500');
			footer.addEventListener('long-press', function(){
				ClipboardJS.copy(m_key)
			})
			{
				if(_timestamp0 != null){
					var text0 = document.createElement('span');
					var txt = ''
					let time_str = getTimeDiffAndPrettyText(_timestamp0).friendlyNiceText;
					// let time_str = formatTimestamp(_timestamp0);
					if(time_str == '-1 Day ago') txt = 'Now'
					else if(time_str == 'NaN Day ago') txt = 'Invalid Time'
					else txt = time_str
					text0.innerHTML = 'Sent : ' + txt + ' | ' + formatTime(_timestamp0)
					footer.appendChild(text0);
				}
				if(_timestamp1){
					var text1 = document.createElement('span');
					var txt = ''
					let time_str = getTimeDiffAndPrettyText(_timestamp1).friendlyNiceText;
					if(time_str == '-1 Day ago') txt = 'Now'
					else if(time_str == 'NaN Day ago') txt = 'Invalid Time'
					else txt = time_str
					text1.innerHTML = 'Seen : ' + txt + ' | ' + formatTime(_timestamp1)
					footer.appendChild(text1);
				}
				if(!val.removed){
					if(_type == 'file'){
						var text2 = document.createElement('span');
						text2.innerHTML = `<div>File Type : ${val.filetype || '-'}</div>`;
						footer.appendChild(text2);		
						
						var text3 = document.createElement('span');
						text3.innerHTML = `<div>File Name : ${val.filename || '-'}</div>`;
						footer.appendChild(text3);
					}
				}
				// if(val.reacts != null){
				// var elm = document.createElement('span');
				// for(key in val.reacts){
				// elm.innerHTML = `<div>Reacts : ${val.reacts[key] || '-'}</div>`;
				// }
				// footer.appendChild(elm);
				// }
			}
			content.appendChild(footer)
		}
		bg.appendChild(content);
	}
	return bg
}


chat_ui.prototype.clear = function(){
	var ref = this;
	database.ref('chats_data/' + ref.cid + '/messages').off('child_added');
	database.ref('chats_data/' + ref.cid + '/messages').off('child_changed');
	database.ref('chats_data/' + ref.cid + '/typing').off('child_changed');
	database.ref('status/' + ref.fid).off('child_changed');
	ref.cid = null;
	ref.fid = null;
	ref.lastAppendDate = null
	ref.latestDoc = null;
	ref._body.content_body.innerHTML = '';
	ref._header.profile_pic.src = '/res/blank-profile.png'
	ref._header.username.innerText = '';
	//
	ref._nav.profile_pic.src = '/res/blank-profile.png';
	ref._nav.title.innerText = '?';
	ref._nav.sub_title.innerText = '?';
	ref._nav.sub_title.setAttribute('href', '#')
	ref.hide_sidenav()
	$(ref._footer.more_div).hide()
	$(ref._body.load_more).show()
	ref.fid_typing.hide()
	ref.clr_title();
	ref.chat_title = null
	ref.destroy_reply();
	ref.unseen_msgs = []
	for (au of ref._audios) {
		au.audio.pause()
		au.audio.remove()
	}
	ref._audios = []
}

chat_ui.prototype.change_msg = function(key, val){
	var ref = this;
	var old_elm = document.getElementById(key);
	if(val.send_from == auth.getUid()){
		var new_elm = ref.new_msg(key, val, 'send');
		$(old_elm).replaceWith(new_elm);
		// anime({
		// targets: new_elm,
		// scale: 1.05,
		// translateX: -10,
		// direction: 'alternate'
		// })
	}
	else{
		var new_elm = ref.new_msg(key, val, 'receive');;
		$(old_elm).replaceWith(new_elm);
		// anime({
		// targets: new_elm,
		// scale: 1.05,
		// translateX: 10,
		// direction: 'alternate'
		// })
	}
}

chat_ui.prototype.update_by_fid = function(fid){
	var ref = this;
	database.ref('chats/' + auth.getUid() + '/' + fid).get().then(function(e){
		ref.update(fid, e.val())
	})
}

chat_ui.prototype.update_by_cid = async function(cid){
	var ref = this;
	let user_0 = await database.ref('chats_data/' + cid + '/user_0').get()
	let user_1 = await database.ref('chats_data/' + cid + '/user_1').get()
	let uid_0 = user_0.val()
	let uid_1 = user_1.val()
	
	if(uid_0 == auth.getUid()) {
		ref.update(uid_1, cid)
	}
	else {
		ref.update(uid_0, cid)
	}
}

chat_ui.prototype.update = function(fid, cid){
	var ref = this;
	ref.cid = cid;
	ref.fid = fid;
	
	ref._footer.textareas[0].value = localStorage.getItem(ref.cid) || ''
	
	database.ref('users/' + fid).get().then(function(e){
		var val = e.val();
		ref._header.profile_pic.src = val.profile_picture;
		ref._header.username.innerText = formatName(val.name[0], val.name[1]);
		//nav
		ref._nav.profile_pic.src = val.profile_picture;
		ref._nav.title.innerText = formatName(val.name[0], val.name[1]);
		ref._nav.sub_title.innerText = '@' + val.username;
		ref._nav.sub_title.setAttribute('target', '_blank')
		ref._nav.sub_title.setAttribute('href', window.location.origin + '/@' + val.username)
		// ref.set_title(`Inbox // @${val.username}`)
		ref.chat_title = val.username
		ref.set_title('')
	})
	
	database.ref('status/' + fid).get().then(function(e){
		var val = e.val().state;
		if(val == 'online'){
			$(ref._header.state).show()
			$(ref._nav.state).show()
			$(ref._nav.info.active).hide()
		}
		else {
			$(ref._header.state).hide()
			$(ref._nav.state).hide()
			$(ref._nav.info.active).show()
			ref._nav.info.active.innerText = 'Last actived ' + getTimeDiffAndPrettyText(e.val().last_changed).friendlyNiceText;
		}
	})
	
	database.ref('chats_data/' + cid + '/typing/' + fid).get().then(function(e){
		if(e.val() == 0 || e.val() == null) {
			ref.fid_typing.hide(200)
		}
		else {
			ref.fid_typing.show(200)
		}	})
	
	database.ref('chats_data/' + cid + '/typing').on('child_changed', function(e){
		if(e.key == fid) {
			if(e.val() == 0 || e.val() == null) {
				ref.fid_typing.hide(200)
			}
			else {
				ref.fid_typing.show(200)
			}
		}
	})
	
	database.ref('status/' + fid).on('child_changed', function(e){
		var val = e.val();
		var key = e.key;
		if(key == 'last_changed'){
			ref._nav.info.active.innerText = 'Last actived ' + getTimeDiffAndPrettyText(val).friendlyNiceText;
		}
		if(key == 'state') {
			if(val == 'online'){
				$(ref._header.state).show()
				$(ref._nav.state).show()
				$(ref._nav.info.active).hide()
			}
			else{
				$(ref._header.state).hide()
				$(ref._nav.state).hide()
				$(ref._nav.info.active).show()
			}
		}
	})
	
	database.ref('chats_data/' + cid + '/messages').orderByChild('timestamp').limitToLast(ref.limit).on('child_added', (snapshot) => {
		var val = snapshot.val();
		var key = snapshot.key;
		// //console.log(snapshot)
		if(ref.latestDoc == null) ref.latestDoc = val.timestamp;
		if(val.type == 'event'){
			let elm = ref.new_event(key, val);
			ref._body.content_body.appendChild(elm)
			if(val.eventType == 'chat-started') $(ref._body.load_more).hide()
		}
		else {
			let d = formatDate(val.timestamp)
			
			if (ref.lastAppendDate != d) {
				ref.lastAppendDate = d
				let elm = document.createElement("div")
				elm.setAttribute('class', 'evnt dteevnt dte')
				// elm.style.
				elm.innerText = formatTS(val.timestamp)
				
				$(ref._body.content_body).append(elm);
				
			}	
			
			if(val.send_from == auth.getUid()){
				var elm = ref.new_msg(key, val, 'send');
				ref._body.content_body.appendChild(elm)
			}
			else {
				
				var elm = ref.new_msg(key, val, 'receive');
				ref._body.content_body.appendChild(elm)
				if(!val.isSeenByReceiver){
					if(document.hidden){
						ref.unseen_msgs.push(key)
					}
					else {
						seeMsg(cid, snapshot.key)
					}
					if(val.type == 'text'){
						let data = val.data || ''
						var txt = data.substr(0, 25)
						if(data.length > 25) ref.set_title(txt + '...')
						else ref.set_title(txt)
					}
					else if(val.type == 'emoji'){
						ref.set_title((all_supported_emoji_code[all_supported_emoji.indexOf(val.emoji)] || 'Emoji'))
					}
					else if(val.type == 'file') {
						ref.set_title(val.filename)
					}
					else {
						ref.set_title(val.type)
					}
					if(Notification.permission == 'granted' && document.hidden) {
						// var title = 'Inbox || @' + ref.chat_title
						var title = ref.chat_title
						if(val.type == 'text' || val.type == 'code'){
							var greeting = new Notification(title,{
								body: val.data,
								icon : ref._header.profile_pic.src,
								badge : ref._header.profile_pic.src
							})
							setTimeout(() => greeting.close(), 5*1000);
						}
						else if(val.type == 'emoji'){
							var greeting = new Notification(title,{
								body: '@' + ref.chat_title + ' has sent a emoji!',
								icon : emoji_img_src(val.emoji),
								badge : ref._header.profile_pic.src
							})
							setTimeout(() => greeting.close(), 5*1000);
						}
						else if(val.type == 'file'){
							if (is_image_type(val.filetype)) {
								var greeting = new Notification(title,{
									body: val.filename,
									icon : ext_filetype_svg_src(val.ext),
									image : val.url,
									badge : ref._header.profile_pic.src
								})
								setTimeout(() => greeting.close(), 5*1000);
							}
							else {
								var greeting = new Notification(title,{
									body: val.filename,
									icon : ext_filetype_svg_src(val.ext),
									badge : ref._header.profile_pic.src
								})
								setTimeout(() => greeting.close(), 5*1000);
							}
						}
					}
				}
			}
		}
		ref.scroll_bottom()
	});
	
	database.ref('chats_data/' + cid + '/messages').on('child_changed', (e) => {
		// database.ref('chats_data/' + cid + '/messages/' + snapshot.key).get().then(function(e){
		var _key = e.key;
		var _val = e.val();
		ref.change_msg(_key, _val)
		// if((ref.body.scrollTop + ref.body.offsetHeight) == ref.body.scrollHeight) {
		// ref.scroll_bottom()
		// //console.log(ref.body.scrollTop + ref.body.offsetHeight, ref.body.scrollHeight)
		// }
		// })
	});
	
	ref.update_msg_field();
	ref._footer.icons[1].src = emoji_img_src(ref.user_emoji);
	ref._footer.icons[1].setAttribute('onContextMenu', 'return false;')
	
	if(Notification.permission != 'granted') {
		Notification.requestPermission().then(function(e){
			if (e == 'granted') {
				navigator.serviceWorker.ready.then(function(registration) {
					registration.showNotification('Notification with ServiceWorker');
				});
			}
		})
	}
}

chat_ui.prototype.loadMoreMsg = function(){
	var ref = this;
	if(ref.latestDoc != null){
		database.ref('chats_data/' + ref.cid + '/messages')
		.orderByChild('timestamp')
		.endBefore(ref.latestDoc).limitToLast(ref.limit)
		.once('value')
		.then(function(e){
			let count = 0;
			let lastElm = null;
			if(e.hasChildren()){
				e.forEach(function(f){
					let val = f.val()
					
					let d = formatDate(val.timestamp)
					
					if (ref.lastAppendDate != d) {
						ref.lastAppendDate = d
						let elm = document.createElement("div")
						elm.setAttribute('class', 'evnt dte')
						elm.innerText = formatTS(val.timestamp)
						if('event' != val.type){
							if(lastElm != null) {
								$(elm).insertAfter(lastElm)
							}
							else {
								$(ref._body.content_body).prepend(elm);
							}
							lastElm = elm
						}
					}
					
					let key = f.key
					let elm;
					if('event' == val.type){
						elm = ref.new_event(f.key, f.val());
						if(val.eventType == 'chat-started') $(ref._body.load_more).hide()
					}
					else if(auth.getUid() == val.send_from) elm = ref.new_msg(f.key, f.val(), 'send');
					else elm = ref.new_msg(f.key, f.val(), 'receive');
					if(lastElm != null) {
						$(elm).insertAfter(lastElm)
					}
					else {
						$(ref._body.content_body).prepend(elm);
					}
					lastElm = elm
					if(count == 0) ref.latestDoc = val.timestamp
					count++
				})
				// $(ref._body.load_more).show()
			}
			else {
				$(ref._body.load_more).hide()
			}
		});
	}
	else{
		//do nothing
		//console.log('nothing...')
	}
}

chat_ui.prototype.scroll_bottom = function(){
	this.body.scrollTop = this.body.scrollHeight;
}

chat_ui.prototype.set_title = function(str){
	if(typeof this.chat_title == 'string') {
		let hip = ''
		if(str.length > 0) hip = ' - '
		let len = '(' + this.unseen_msgs.length + ') '
		if(this.unseen_msgs.length == 0) document.title = '@' + this.chat_title + hip + str + ' // Inbox'
		else document.title = len + '@' + this.chat_title + hip + str + ' // Inbox'
	}
	else {
		document.title = '// Inbox'
	}
	
}

chat_ui.prototype.clr_title = function(){
	document.title = 'Hellocat'
}

chat_ui.prototype.onvisibilitychange = function(event){
	var ref = this
	if($(ref.element).is(":visible")){
		if(!document.hidden){
			for (var i = 0; i < ref.unseen_msgs.length; i++){
				let key = ref.unseen_msgs[i]
				seeMsg(ref.cid, key)
			}
			ref.unseen_msgs = []
			ref.set_title('')
		}
	}
}

chat_ui.prototype.adjustFooter = function(){
	var ref = this;
	var text = ref._footer.textareas[0].value;
	var text_arr = text.split('\n');
	
	let scroll_height = ref._footer.textareas[0].scrollHeight;
	
	if(text_arr.length > 1) {
		if(scroll_height < 100) {
			ref._footer.textareas[0].style.height = scroll_height;
			ref.footer.style.height = scroll_height + (scroll_height*0.2);
			ref.adjustHeightsAccordingFooter()
		}
		else {
			ref._footer.textareas[0].style.height = 100;
			ref.footer.style.height = 100 + (100*0.2);
			ref.adjustHeightsAccordingFooter()
		}
		ref._footer.textareas[0].style.borderRadius = '5px'
	}
	else {
		ref._footer.textareas[0].style.height = 40
		ref._footer.textareas[0].style.borderRadius = '10px'
		ref.resetHeights()
	}
}


chat_ui.prototype.adjustHeightsAccordingFooter = function(){
	var ref = this;
	let header_h = 0
	let footer_h = 0
	if($(ref.header).is(":visible")) header_h = ref.header.offsetHeight
	footer_h = ref.footer.offsetHeight
	
	ref.body.style.height = ref.element.offsetHeight - (header_h + footer_h)
	ref.body.style.bottom = footer_h
}

chat_ui.prototype.resetHeights = function(){
	var ref = this;
	ref.body.style.height = '80%'
	ref.body.style.bottom = '10%'
	if($(ref.header).is(":visible")) ref.footer.style.height = '10%'
	else ref.footer.style.height = '20%'
}


chat_ui.prototype.update_msg_field = function(){
	var ref = this;
	const _text = ref._footer.textareas[0].value
	var text = (_text || '').replace(/(?:\\r\\n|\\r|\\n)/gm, ' ').trim();
	
	// //console.log(text)
	
	ref.adjustFooter()
	
	if(text.length > 0){
		$(ref._footer.icons[0]).show()
		$(ref._footer.icons[1]).hide()
	}
	else{
		$(ref._footer.icons[0]).hide()
		$(ref._footer.icons[1]).show()
	}
}

chat_ui.prototype.show_sidenav = function(){
	this.sidenav.style.width = "250px";
	this.sidenav.style.padding = "10px";
}
chat_ui.prototype.hide_sidenav = function(){
	this.sidenav.style.width = "0";
	this.sidenav.style.padding = "0";
}

chat_ui.prototype.send_msg = function(availableTags, strict=false){
	var ref = this
	var _text = ref._footer.textareas[0].value;
	var text = (_text || '').replace(/(?:\\r\\n|\\r|\\n)/gm, ' ').trim();
	
	if (function(){
		let ps = parseStyleSheet(text)
		
		if (ps != null) {
			let t = text.split("\n").slice(1).join("\n").trim()
			if (t == "") return true
			text = t
		}
		
		let x = text.split("*")
		if(x.length == 2){
			let a = x[0]
			let b = x[1]
			b = parseInt(b, 16)
			if (all_supported_emoji_code.includes(a) && b >= 18 && b <= 255) {
				let emo = all_supported_emoji[all_supported_emoji_code.indexOf(a)]
				sendEmojiMsg(auth.getUid(), ref.fid, ref.cid, emo, b, ref.reply_id, ps);
				return
			}
		}
		
		
		if(/data:([a-zA-Z\/]+);base64,/.test(text) && _text[0] == 'd') {
			let type = text.slice(text.indexOf(":") + 1, text.indexOf(";"))
			let ext = getExt(type)
			let name = formatTimestamp(new Date()).toUpperCase() + '.' + ext
			if(type.length > 0) {
				ref.uploadTask(text, name, type, ext)
				return
			}
		}
		
		if (all_supported_emoji_code.includes(text)) {
			let emo = all_supported_emoji[all_supported_emoji_code.indexOf(text)]
			sendEmojiMsg(auth.getUid(), ref.fid, ref.cid, emo, 25, ref.reply_id, ps);
			return
		}
		else if(text.length > 0){
			if (text.length < 3001){
				sendTextMsg(auth.getUid(), ref.fid, ref.cid, text, ref.reply_id, ps);
			}
			else {
				var data = new Blob([text], { type: 'text/plain' })
				ref.uploadTaskDirect(data, 'Long Message.txt', 'text/plain', 'txt');
			}
			return
		}
		else { 
			if(!strict) sendEmojiMsg(auth.getUid(), ref.fid, ref.cid, ref.user_emoji, ref.emoji_size, ref.reply_id);
			return
		}
		return true
	}() == true) return
	if(ref.reply_mode == true) {
		ref.destroy_reply()
	}
	ref._footer.textareas[0].value = ''
	ref.update_msg_field();
	ref.scroll_bottom()
}

chat_ui.prototype.init = function(__ref){
	var ref = this;
	
	// // Prevent the default behavior for drag and drop
	// ref.body.addEventListener("dragenter", (e) => {
	// e.preventDefault();
	// ref._footer.textareas[0].classList.add("drag-over");
	// });
	
	// ref.body.addEventListener("dragleave", () => {
	// ref._footer.textareas[0].classList.remove("drag-over");
	// });
	
	// ref.body.addEventListener("dragover", (e) => {
	// e.preventDefault();
	// });
	
	// ref._footer.textareas[0].addEventListener("drop", (e) => {
	// e.preventDefault();		
	// const file = e.dataTransfer.files[0];
	// if (file) {
	// const reader = new FileReader();
	// reader.onload = (e) => {
	// ref._footer.textareas[0].value = e.target.result;
	// };
	// reader.readAsDataURL(file);
	// }
	// });
	
	$(ref._footer.textareas[0]).on("focus", function() {
		database.ref('/chats_data/' + ref.cid + '/typing/' + auth.getUid()).set(firebase.database.ServerValue.TIMESTAMP)
	})
	
	$(ref._footer.textareas[0]).on("focusout", function() {
		database.ref('/chats_data/' + ref.cid + '/typing/' + auth.getUid()).set(0)
	})
	
	ref._footer.textareas[0].addEventListener("drop", (e) => {
		e.preventDefault();		
		if(confirm(`Do you want to upload ${e.dataTransfer.files.length} files?`))
		for (var k = 0; k < e.dataTransfer.files.length; k++){
			const file = e.dataTransfer.files[k]
			if (file.name) {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				const file_name = file.name;
				const file_ext = file_name.split('.').pop();
				const file_type = file.type;
				reader.onload = function (f) {
					ref.uploadTask(f.target.result, file_name, file_type, file_ext);
				}
			}
		}
	});
	
	
	
	
	$(ref.codeWrite).hide()
	//code send
	let langs = ["katex", ...hljs.listLanguages()]
	for (lang of langs) {
		$(this._codeWrite.select).append($(`<option value="${lang}">${lang}</option>`))
	}
	$(this._codeWrite.buttons[0]).click(function(){
	    $(ref.codeWrite).hide()
	})
	$(this._codeWrite.buttons[1]).click(function(){
		let text = $(ref._codeWrite.textarea).val() || ""
		let lang = $(ref._codeWrite.select).val()
		if (text.trim().length > 0 && langs.includes(lang)) {
			if(text.length < 2001) {
				sendCodeMsg(auth.getUid(), ref.fid, ref.cid, text, lang, ref.reply_id);
			}
			else {
				var data = new Blob([text], { type: 'text/plain' })
				ref.uploadTaskDirect(data, lang + '.txt', 'text/plain', 'txt');
			}
			$(ref.codeWrite).hide()
			$(ref._codeWrite.textarea).val("")
		}
	})
	
	//emojji suggestions
	var availableTags = [];
	
	for (c of all_supported_emoji_code) {
		if (c != null) availableTags.push(c)
	}
	
	var start_pos = 0
	var res_ = ""
    $(ref._footer.textareas[0]).on("input", function() {
		ref.update_msg_field()
		var textarea = $(this);
		let txt = textarea.val()
		let startPos = textarea[0].selectionStart
		let __startPos = startPos
		let res = ""
		
		let i = 0;
		while (startPos > 0) {
			let t = txt[startPos - 1]
			if (t == ":") {
				res = txt.slice(startPos - 1, __startPos)
				break
			}
			startPos = startPos - 1
		}
		if (res[0] != ":") return
		start_pos = startPos
		res_ = res
		textarea.autocomplete({
			source: function(request, response) {
				var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
				response($.grep(availableTags, function(item) {
					return matcher.test(item);
				}));
			},
			appendTo: "#autocomplete-suggestions",
			position: { 
				my: "left bottom", 
				at: "left top" 
			},
			create: function () {
				var el_ref = this
				$(this).data('ui-autocomplete')._renderMenu = function (ul, items) {
					var that = this;
					// $.each( items, function( index, item ) {
					// that._renderItemData( ul, item );
					// });
					// $( ul ).find( "li" ).each(function(i, elm){
					// let src = all_supported_emoji[all_supported_emoji_code.indexOf(items[i].value)]
					// $(elm).append(emoji_img(src, 18))
					// })
					$.each(items, function (index, item) {
						var li = $('<li>');
						li.append(emoji_img(all_supported_emoji[all_supported_emoji_code.indexOf(item.value)], 22));
						li.click(function (){
							// //console.log(start_pos, start_pos, res)
							let val = item.value || ""
							var value = textarea.val();
							let start_val = value.slice(0, start_pos - 1)
							let end_val = value.slice(start_pos + res_.length - 1, value.length)
							// //console.log(start_val)
							// //console.log(val)
							// //console.log(end_val)
							let v = start_val + val + " " + end_val
							textarea.val(v);
							var cursorPosition = start_pos + val.length - 1
							if (cursorPosition >= 0 && cursorPosition <=  v.length) {
								textarea[0].selectionStart = cursorPosition;
								textarea[0].selectionEnd = cursorPosition;
								textarea[0].focus(); // Ensure the textarea has focus after setting the position
							}
							ul.hide()
						})
						ul.append(li);
					});
				};  
				$(this).data('ui-autocomplete')._resizeMenu = function () {
					this.menu.element.outerWidth(el_ref.offsetWidth);
					// this.menu.element.outerWidth(el_ref.offsetWidth);
					this.menu.element.css("top", "200px")
					this.menu.element.height(200)
					this.menu.element.css("display", "flex")
				};
			},
			// select: function( event, ui ) {
			// let val = ui.item.value || ""
			// var value = textarea.val();
			// let start_val = value.slice(0, startPos - 1)
			// let end_val = value.slice(startPos + res.length - 1, value.length)
			// let v = start_val + val + " " + end_val
			// textarea.val(v);
			// var cursorPosition = startPos + val.length - 1
			// if (cursorPosition >= 0 && cursorPosition <=  v.length) {
			// textarea[0].selectionStart = cursorPosition;
			// textarea[0].selectionEnd = cursorPosition;
			// textarea[0].focus(); // Ensure the textarea has focus after setting the position
			// }
			// // Prevent default behavior of the autocomplete
			// return false;
			// }
		})
		textarea.autocomplete("search", res);
	})
	
	// show
	$(this._header.profile_pic).click(function(){
		ref.show_sidenav();
	});
	//hide
	$(this.closenav).click(function(){
		ref.hide_sidenav();
	});
	
	$(ref._footer.more_div).hide()
	
	//nav a 
	$(this.nav_a[3]).click(function(){
		if(Notification.permission == 'granted') alert('Notification Permission granted already.')
		else {
			Notification.requestPermission().then(function(e){
				if (e == 'granted') {
					navigator.serviceWorker.ready.then(function(registration) {
						registration.showNotification('Notification with ServiceWorker');
					});
				}
				else if(e != 'granted') {
					alert('Notification Permission not granted.')
				}
			})
		}
	})
	
	//update
	$(ref._body.load_more).click(function(e){
		ref.loadMoreMsg();
	})
	
	//close
	$(ref._header.close_btn).click(function(){
		localStorage.setItem(ref.cid, ref._footer.textareas[0].value)
		__ref.mainBody.show();
		__ref.chat_ui.hide();
		router.redirectTo('/')
		ref.clear();
		$(ref.codeWrite).hide()
		__ref.mainBody.body.chats.update()
	})
	
	
	$(ref._footer.textareas[0]).keypress(function(e) {
		if (e.which == 13 && e.shiftKey) {
			e.preventDefault();
			ref.send_msg(availableTags, true)
		}
	});
	
	//send text
	$(ref._footer.buttons[7]).on("click", function(){
		ref.send_msg(availableTags)
	})
	//send code	
	$(ref._footer.buttons[4]).click(function(){
		$(ref.codeWrite).show()
		$(ref._footer.more_div).hide()
	})
	//location
	$(ref._footer.buttons[5]).on("click", function(){
		if(confirm("Do you want to share your current location?"))
		navigator.geolocation.getCurrentPosition(function(e){
			let text = `https://www.google.com/maps?q=${e.coords.latitude},${e.coords.longitude}`
			sendTextMsg(auth.getUid(), ref.fid, ref.cid, text, ref.reply_id);
		});
	})
	//reply cancel
	$(ref._footer.buttons[8]).on("click", function(){
		ref.destroy_reply()
	})
	//send img
	$(ref._footer.buttons[6]).click(function(){
		ref.sendImageFile()
	})
	//send file
	$(ref._footer.buttons[3]).click(function(){
		ref.sendFile()
		$(ref._footer.more_div).hide()
	})
	//send voice
	$(ref._footer.buttons[2]).click(function(){
		new VoiceUI(function(audio_data){
			const e_audio_name = 'hc-audio-' + formatTimestamp(new Date()).toLowerCase() + '.wav';
			ref.uploadTaskDirect(audio_data, e_audio_name, 'audio/wav', 'wav');
		})
		$(ref._footer.more_div).hide()
	})
	//send camera
	$(ref._footer.buttons[1]).click(function(){
		var wc = new WebCamUI()
		wc.createInterface(function(e){
			const e_img_name = 'hc-webcam-' + formatTimestamp(new Date()).toLowerCase() + '.png';
			ref.uploadTask(e.img_data, e_img_name, 'image/png', 'png');
			e.destroy();
		})
		$(ref._footer.more_div).hide()
	})
	//send more
	$(ref._footer.buttons[0]).click(function(){
		$(ref._footer.more_div).slideToggle('fast')
	})
	
}

chat_ui.prototype.destroy_reply = function(){
	var ref = this
	ref.reply_mode = false
	ref.reply_id = null
	$(ref._footer.buttons[8]).hide()
}

chat_ui.prototype.sendImageFile = function(){
	var ref = this;
	ref.WebImageEditor.loadImage0()
	ref.WebImageEditor.createInterface(function(e){
		ref.uploadTask(e.getImageData(), e.img_name, 'image/png', 'png');
		e.destroy()
	});
}

chat_ui.prototype.sendFile = function(){
	var ref = this;
	var input = document.createElement('input');
	input.type = 'file';
	input.setAttribute('multiple', 'true')
	input.click();
	input.addEventListener('change', function (e) {
		for (var k = 0; k < e.target.files.length; k++){
			const file = e.target.files[k]
			if (file.name) {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				const file_name = file.name;
				const file_ext = file_name.split('.').pop();
				const file_type = file.type;
				reader.onload = function (f) {
					ref.uploadTask(f.target.result, file_name, file_type, file_ext);
				}
			}
		}
	});
}


chat_ui.prototype.uploadTask = function(file_data, file_name='', file_type='', file_ext=''){
	const ref = this;
	const ref_fid = ref.fid;
	const ref_cid = ref.cid;
	const hash = SparkMD5.hash(file_data);
	const uid = auth.getUid();
	database.ref('file_hash/' + uid + '/' + hash).get().then(function(g){
		if(g.exists()){
			// //console.log(g.val(), g.key)
			sendFileMsg(auth.getUid(), ref_fid, ref_cid, g.val(), file_type, file_name, file_ext, ref.reply_id)
			ref.destroy_reply()
		}
		else {
			const storageRef = storage.ref('0xab/' + uid + '/' + hash + '/' + file_name);
			const uploadTask = storageRef.putString(file_data, 'data_url');
			const progress_bar = new UploadProgressBar();
			progress_bar.createInterface(ref._body.content_body);
			progress_bar.components[3].innerText = file_name;
			ref.scroll_bottom()
			uploadTask.then(function(snapshot){
				snapshot.ref.getDownloadURL().then(function(file_url){
					database.ref('file_hash/' + uid + '/' + hash).set(file_url)
					sendFileMsg(auth.getUid(), ref_fid, ref_cid, file_url, file_type, file_name, file_ext, ref.reply_id)
					progress_bar.destroy();
					ref.destroy_reply()
				});
			});
			uploadTask.on('state_changed', function(data){
				var percent = (data.bytesTransferred/data.totalBytes) * 100 
				progress_bar.setPercent(percent);
			})
		}
	})
}


chat_ui.prototype.uploadTaskDirect = function(file_data, file_name='', file_type='', file_ext=''){
	var ref = this;
	const ref_fid = ref.fid;
	const ref_cid = ref.cid;
	const hash = randomString(32).toLowerCase();
	const uid = auth.getUid();
	const storageRef = storage.ref('0xab/' + uid + '/' + hash + '/' + file_name);
	const uploadTask = storageRef.put(file_data, 'data_url');
	const progress_bar = new UploadProgressBar();
	progress_bar.createInterface(ref._body.content_body);
	progress_bar.components[3].innerText = file_name;
	ref.scroll_bottom()
	uploadTask.then(function(snapshot){
		snapshot.ref.getDownloadURL().then(function(file_url){
			sendFileMsg(auth.getUid(), ref_fid, ref_cid, file_url, file_type, file_name, file_ext, ref.reply_id)
			progress_bar.destroy();
			ref.destroy_reply()
		});
	});
	uploadTask.on('state_changed', function(data){
		var percent = (data.bytesTransferred/data.totalBytes) * 100 
		progress_bar.setPercent(percent);
	})
}
