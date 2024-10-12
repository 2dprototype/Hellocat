function loadFriends(){
	var ref = this;
	this.bg = document.createElement('div');
	this.bg.setAttribute('class', 'load-friends-bg');
	{
		this.main = document.createElement('div');
		this.main.setAttribute('class', 'load-friends');
		{
			this.header = document.createElement('div');
			this.header.setAttribute('class', 'header');
			{
				this.close = document.createElement('div');
				this.close.onclick = function(){ ref.destroy() }
				{
					this.close_img = new Image();
					this.close_img.setAttribute('class', 'close');
					this.close_img.src = 'res/icon/fill/close.svg';
					this.close_img.height = 25;
					this.close_img.width = 25;
					this.close_img.onload = function(){ SVGInject(this) }
					this.close.appendChild(this.close_img);
				}
				this.header.appendChild(this.close);
			}
			{
				this.title = document.createElement('div');
				this.title.innerText = 'Friends'
				this.header.appendChild(this.title);
			}
			this.main.appendChild(this.header);
		}
		{
			this.body = document.createElement('div');
			this.body.setAttribute('class', 'body');
			this.main.appendChild(this.body);
		}
		this.bg.appendChild(this.main);
	}
	document.querySelector('body').appendChild(this.bg);
}

loadFriends.prototype.load = async function(){
	var ref = this;
	var e_data = await database.ref('friendships/' + auth.getUid()).get()
	e_data.forEach(function(f){
		var fid = f.key;
		database.ref('users/' + fid).get().then(function(g){
			ref.loadUser(g.val(), fid);
		})
	})
	var m_data = await database.ref('chats/' + auth.getUid()).get()
	m_data.forEach(function(f){
		var key = f.key
		var eid = 'cv_' + key
		$('#' + eid).css('opacity', '0.4')
		// $('#' + eid).off('click');
		// $('#' + eid).find('.title').css('color', 'blue')
	})
}


loadFriends.prototype.destroy = function(){
	this.bg.remove();
}

loadFriends.prototype.loadUser = function(data, fid){
	var ref = this;
	var FP = new friend_profile();
	FP.profile.src = data.profile_picture;
	FP.title.innerText = formatName(data.name[0], data.name[1]);
	FP.subtitle.innerText = '@' + data.username;
	FP.body.setAttribute('id', 'cv_' + fid)
	FP.body.onclick = function(){
		createConversation(auth.getUid(), fid, function(){
		    app.mainBody.body.chats.update()
		});
		ref.destroy();
	}
	this.body.appendChild(FP.body);
}


function friend_profile(){
	this.body = document.createElement('div');
	this.body.setAttribute('class', 'friend-id');
	{
		this.profile = new Image();
		this.profile.src = 'res/blank-profile.png'
		this.profile.setAttribute('class', 'img');
		this.profile.height = 40;
		this.profile.width = 40;
		this.body.appendChild(this.profile);
	}
	{
		this.title = document.createElement('div');
		this.title.setAttribute('class', 'title');
		this.body.appendChild(this.title);
	}
	{
		this.subtitle = document.createElement('div');
		this.subtitle.setAttribute('class', 'subtitle');
		this.subtitle.innerText = '';
		this.body.appendChild(this.subtitle);
	}
}