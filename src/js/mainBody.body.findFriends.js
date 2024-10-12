function findFriends(body){
	this.element = $(body).find('#find-friends')[0];
	this.searchBox = {
		input : $(this.element).find('input')[0],
		button : $(this.element).find('button')[0]
	}
	this.user_list = $(this.element).find('.user-list')[0];
}

findFriends.prototype.hide = function(){
	$(this.element).hide(200);
}

findFriends.prototype.show = function(){
	$(this.element).show(200);
}

findFriends.prototype.clear = function(){
	this.user_list.innerHTML = '';
}


findFriends.prototype.init = function(__ref){
	var ref = this;
	//console.log(ref)
	$(ref.searchBox.button).click(function(){
		var str = ref.searchBox.input.value
		if(str.length > 0){
			ref.user_list.innerHTML = ''
			database.ref('users').orderByChild('username').startAt(str).endAt(str+'\uf8ff').once('value', function(users){
				users.forEach(function (data) {
					ref.addUsers(data)
				});
				if(users.numChildren() == 0) {
					let txt = ref.searchBox.input.value;
					var node_1 = document.createElement('DIV');
					node_1.setAttribute('class', 'box');
					
					var node_2 = document.createElement('DIV');
					node_2.innerText = 'No username starts with '
					node_1.appendChild(node_2);
					
					var node_3 = document.createElement('SPAN');
					node_3.setAttribute('class', 'link');
					node_3.innerText = txt
					node_2.appendChild(node_3);
					
					ref.user_list.appendChild(node_1)
				}
			})
		}
	})
}

findFriends.prototype.updateUserLists = function(__ref){
	var ref = this;
	ref.clear();
	
	firebase.database().ref('users').get().then(function(users){
		users.forEach(function (data) {
			ref.addUsers(data)
		});
		if(users.numChildren() == 0) {
			let txt = ref.searchBox.input.value;
			{
				var node_0 = document.createElement('div');
				node_0.setAttribute('class', 'box')
				{
					var node_1 = document.createElement('div');
					node_1.innerText = 'No User Found'
					node_0.appendChild(node_1)
				}
				ref.user_list.appendChild(node_0)
			}
		}
	});
	
	
}

findFriends.prototype.addUsers = function(data){
	var ref = this
	var val = data.val();
	var profile_pic = val.profile_picture;
	var name = formatName(val.name[0], val.name[1]);
	var username = val.username;
	var ranking = val.ranking;
	
	
	if(data.key == auth.getUid()){
		ref.addUser(profile_pic, name, username, data.key, null, ranking);
	}
	else {
		getRelationType(auth.getUid(), '0XtYRyMB6qYzB8tFFPKotm1aqZD3').then(function(e){
			if(e.is_friend) ref.addUser(profile_pic, name, username, data.key, 'friend', ranking);
			else if(e.sent) ref.addUser(profile_pic, name, username, data.key, 'pending', ranking);
			else if(e.recieved) ref.addUser(profile_pic, name, username, data.key, null, ranking);
			else ref.addUser(profile_pic, name, username, data.key, 'add', ranking);
		})
	}
}

findFriends.prototype.addUser = function(src, name, username, uid, icon, ranking){
	var ref = this;
	// $(ref.user_list).append(`
	// <div class="user-profile">
	// ${function(){
	// if(src == undefined) return '<img class="profile-pic" src="res/blank-profile.png" width="40" height="40"/>';
	// else return '<img class="profile-pic" src="' + src + '" width="40" height="40"/>';
	// }()}
	// <div class="title">
	// <div class="name" onclick="router.redirectTo('u/${uid}')">${name}</div>
	// ${function(){
	// if(ranking == 'artist') return '<img onload="SVGInject(this)" class="ranking" src="res/icon/ranking/artist.svg" width="12" height="12"/>';
	// else if(ranking == 'vip') return '<img onload="SVGInject(this)" class="ranking vip" src="res/icon/ranking/vip.svg" width="12" height="12"/>';
	// else if(ranking == 'user') return '<img onload="SVGInject(this)" class="ranking" src="res/icon/ranking/user.svg" width="12" height="12"/>';
	// else return '';
	// }()}
	// </div>
	// <span class="subtitle">@${username}</span>
	// ${function(){
	// if(icon == 'friend') return '<div class="friend-btn"><img onload="SVGInject(this)" src="res/icon/bi-person-check-fill.svg" width="18" height="18"/></div>';
	// else if(icon == 'add') return '<div class="friend-btn"><img onload="SVGInject(this)" src="res/icon/bi-person-plus.svg" width="18" height="18"/></div>';
	// else if(icon == 'pending') return '<div class="friend-btn"><img onload="SVGInject(this)" src="res/icon/fill/pending.svg" width="18" height="18"/></div>';
	// else return '';
	// }()}
	// </div>
	// `);
	let el = new user_profile()
	el.title_span0.innerText = name
	el.subtitle.innerText = '@'+username
	el.profile.src = src
	database.ref('status/' + uid).get().then(function(g){
		var val = g.val().state;
		if(val == 'online') $(el.state).show()
	})			
	el.title_span0.onclick = function () {
		router.redirectTo('u/' + uid)
	}
	$(ref.user_list).append(el.body)
}


function user_profile(){
	this.body = document.createElement('div');
	this.body.setAttribute('class', 'conversation-profile');
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