function friendList(body){
	this.prev_element = body;
	this.element = $(body).find('#friend-list')[0];
	this.searchBox = {
		input : $(this.element).find('input')[0],
		button : $(this.element).find('button')[0],
		box : $(this.element).find('.search-box')[0]
	}
	this.buttons = $(this.element).find('.button')
	this.friendList = $(this.element).find('.friends-list')[0];
	this.friendPending = $(this.element).find('.friends-pending')[0];
	this.friendRequest = $(this.element).find('.friends-requests')[0];
	
}

friendList.prototype.hide = function(){
	$(this.element).hide();
}

friendList.prototype.show = function(){
	$(this.element).show();
}


friendList.prototype.resize = function(){
	this.friendList.style.top = this.searchBox.box.offsetHeight;
}

friendList.prototype.filter_friendlist = function(){
	var filter;
	var ref = this;
	var div = $(ref.friendList).find(".friend-profile");
	
	filter = ref.searchBox.input.value.toLowerCase();
	
	for(i = 0; i < div.length; i++){
		var name = $(div[i]).find('.title')[0].innerText;
		var username = $(div[i]).find('.subtitle')[0].innerText;
		if(filter[0] == '@'){
			var __filter = filter.slice(1, filter.length);
			if(username.toLowerCase().indexOf(__filter) > -1) {
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

friendList.prototype.reset = function(__ref){
	var ref = this;
	$(ref.friendList).show()
	$(ref.friendPending).hide()
	$(ref.friendRequest).hide()
}

friendList.prototype.init = function(__ref){
	var ref = this;
	
	$(ref.buttons[0]).click(function(){
		$(ref.friendList).show()
		$(ref.friendPending).hide()
		$(ref.friendRequest).hide()
	    ref.updateFriendLists()
	})
	
	$(ref.buttons[1]).click(function(){
		$(ref.friendList).hide()
		$(ref.friendPending).show()
		$(ref.friendRequest).hide()
	    ref.updateFriendPending()
	})
	
	$(ref.buttons[2]).click(function(){
		$(ref.friendList).hide()
		$(ref.friendPending).hide()
		$(ref.friendRequest).show()
	    ref.updateFriendRequest()
	})
	
	//match firends name
	ref.searchBox.input.onkeyup = function(){
		ref.filter_friendlist();
	}
	ref.searchBox.input.onkeydown = function(){
		ref.filter_friendlist();
	}
	//clear match box
	ref.searchBox.button.onclick = function(){
		ref.searchBox.input.value = "";
		ref.filter_friendlist();
	}
	
	
	//console.log(ref)
}

friendList.prototype.updateFriendPending = function(){
	var ref = this;
	ref.friendPending.innerHTML = '';
	database.ref('friend_req/sent/' + auth.getUid()).get().then(function(e) {
		e.forEach(function(f){
			ref.fetch_user(ref.friendPending, f.key)
		})
		if(e.numChildren() == 0){
			$(ref.friendPending).html(`<div class="box">No request is on pending...</div>`)
		}
	})
}

friendList.prototype.updateFriendRequest = function(){
	var ref = this;
	ref.friendRequest.innerHTML = '';
	database.ref('friend_req/recieved/' + auth.getUid()).get().then(function(e) {
		e.forEach(function(f){
			ref.fetch_user(ref.friendRequest, f.key)
		})
		if(e.numChildren() == 0){
			$(ref.friendRequest).html(`
				<div class="box">
					<span>No friend request...</span>
				</div>
			`)
		}
	})
}

friendList.prototype.updateFriendLists = function(){
	var ref = this;
	ref.friendList.innerHTML = '';
	database.ref('friendships/' + auth.getUid()).get().then(function(e) {
		e.forEach(function(f){
			ref.fetch_user(ref.friendList, f.key)
		})
		if(e.numChildren() == 0){
			$(ref.friendList).html(`
				<div class="box">
					<span>No friends...</span>
					<span class="link" onclick="router.navigateTo('/findFriends')">Find Friends</span>
				</div>	
			`)
		}
	})
}

friendList.prototype.fetch_user = function(__elm, key){
	var ref = this
	database.ref('users/' + key).get().then(function(data){
		var val = data.val();
		var name = formatName(val.name[0], val.name[1]);
		var profile_picture = val.profile_picture;
		var username = val.username;
		var ranking = val.ranking;
		ref.addUser(__elm, key, profile_picture, name, username, ranking);
	});
}


friendList.prototype.addUser = function(__elm, uid, src, title, sub, ranking){
	var ref = this;
	let el = new user_profile()
	el.title_span0.innerText = title
	el.subtitle.innerText = '@'+sub
	el.profile.src = src
	database.ref('status/' + uid).get().then(function(g){
		var val = g.val().state;
		if(val == 'online') $(el.state).show()
	})			
	el.title_span0.onclick = function () {
		router.redirectTo('@' + sub)
	}
	$(__elm).append(el.body)
}