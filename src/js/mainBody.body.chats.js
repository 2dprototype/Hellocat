function hellocatChatsList(body){
	this.element = $(body).find('#chats')[0];
	this.header = $(this.element).find('.header')[0];
	this.body = $(this.element).find('.body')[0];
	this.footer = $(this.element).find('.footer')[0];
	this.newButton = $(this.footer).find('.new')[0];
	this._header = {
		buttons : $(this.header).find('button'),
		inputs : $(this.header).find('input')
	}
}

hellocatChatsList.prototype.hide = function(){
	$(this.element).hide();
}

hellocatChatsList.prototype.show = function(){
	$(this.element).show();
}

hellocatChatsList.prototype.clear = function(){
	this.body.innerHTML = '';
}

hellocatChatsList.prototype.filter_chatlist = function(){
	var filter;
	var ref = this;
	var div = $(ref.body).find(".conversation-profile");
	
	filter = ref._header.inputs[0].value.toLowerCase();
	
	for(i = 0; i < div.length; i++){
		var name = $(div[i]).find('.title')[0].innerText;
		var sub = $(div[i]).find('.subtitle')[0].innerText;
		if(filter[0] == ':'){
			var __filter = filter.slice(1, filter.length);
			if(sub.toLowerCase().indexOf(__filter) > -1) {
				$(div[i]).show();
			}
			else {
				$(div[i]).hide();
			}
		}
		else{
			if(name.toLowerCase().indexOf(filter) > -1) {
				$(div[i]).show();
			}
			else {
				$(div[i]).hide();
			}
		}
	}
	
}

hellocatChatsList.prototype.update = function(){
	var ref = this;
	ref.clear();
	
	database.ref('chats/' + auth.getUid()).get().then(function(chats_id){
		chats_id.forEach(function(chat_id) {
			var cid = chat_id.val();
			var fid = chat_id.key;
			var chat_profile = new conversation_profile(fid, cid);
			database.ref('status/' + fid).get().then(function(e){
				var val = e.val().state;
				if(val == 'online') $(chat_profile.state).show()
			})			
			database.ref('users/' + fid).get().then(function(user_snap){
				var user_data = user_snap.val();
				chat_profile.profile.src = user_data.profile_picture;
				chat_profile.title_span0.innerText = formatName(user_data.name[0], user_data.name[1]);
				
			})
			database.ref('chats_data/' + cid).get().then(function(chat_data_snap){
				var chat_data = chat_data_snap.val();
				chat_profile.body.setAttribute('id', chat_data_snap.key);
				get_last_msg(cid, function(val){
					if(val.removed){
						chat_profile.subtitle.innerText = 'Message Removed.'
						chat_profile.subtitle.style.fontStyle = 'italic'
					}
					else chat_profile.subtitle.innerText = (val.data || val.filename || val.emoji || val.eventType || '').split('\n')[0];
					chat_profile.title_span1.innerText = function(time_str){
					    if(time_str == '-1 Day ago') return 'Now'
						else if(time_str == 'NaN Day ago') return 'Invalid Time'
						else return time_str
					}(getTimeDiffAndPrettyText(val.timestamp).friendlyNiceText)
					if(!val.isSeenByReceiver && (val.send_from != auth.getUid())){
						chat_profile.subtitle.style.fontWeight = 'bold';
						chat_profile.subtitle.style.opacity = '1';
					}
					chat_profile.body.setAttribute('index', val.timestamp);
					ref.assembleIDsByTimestamp();
				})
			})
			.catch(function(err){
				removeConversationFromList(auth.getUid(), fid)
			})
			ref.renderChat(chat_profile);
		})
	})	
}


hellocatChatsList.prototype.assembleIDsByTimestamp = function(){
	var ref = this;
	$(ref.body).find('.conversation-profile').sort(function (a, b) {
		return $(b).attr('index') - $(a).attr('index');
	}).appendTo(ref.body);
}

hellocatChatsList.prototype.renderChat = function(elm){
	var ref = this;
	ref.body.appendChild(elm.body);
}


hellocatChatsList.prototype.init = function(__ref){
	var ref = this;	
	ref.newButton.onclick = function(){
		var load_friends = new loadFriends();
		load_friends.load();
	}
	ref._header.inputs[0].onkeyup = function(){
		ref.filter_chatlist()
	}
	ref._header.inputs[0].onkeydown = function(){
		ref.filter_chatlist()
	}
	ref._header.buttons[0].onclick = function(){
		ref._header.inputs[0].value = ''
		ref.filter_chatlist()
	}
}


function conversation_profile(fid, cid){
	this.body = document.createElement('div');
	this.body.setAttribute('class', 'conversation-profile');
	this.body.onclick = function(){
		// router.navigateTo('inbox/' + fid)
		router.navigateTo('c/' + cid)
	}
	{
		
		this.m_div = document.createElement('div');
		this.m_div.setAttribute('class', 'img');
		{
			this.profile = new Image();
			this.profile.src = 'res/blank-profile.png'
			this.profile.setAttribute('class', 'icon');
			this.profile.height = 50;
			this.profile.width = 50;
			this.m_div.appendChild(this.profile);
		}
		{
			let svg = `<svg style="" class="state" height="10" width="10">
			<circle cx="5" cy="5" r="5" fill="var(--active-status-color)"></circle>
			</svg>`
			this.state = $(svg)[0]
			this.state.style.display = 'none'
			$(this.m_div).append(this.state);
		}
		this.body.appendChild(this.m_div);
	}
	{
		this.title = document.createElement('div');
		this.title.setAttribute('class', 'title');
		{
			this.title_span0  = document.createElement('span');
			this.title_span0.innerText = '';
			this.title_span0.setAttribute('class', 'span0');
			this.title.appendChild(this.title_span0);
		}
		{
			this.title_span1  = document.createElement('span');
			this.title_span1.innerText = '';
			this.title_span1.setAttribute('class', 'span1');
			this.title.appendChild(this.title_span1);
		}
		this.body.appendChild(this.title);
	}
	{
		this.subtitle = document.createElement('div');
		this.subtitle.setAttribute('class', 'subtitle');
		this.subtitle.innerText = '';
		this.body.appendChild(this.subtitle);
	}
}
