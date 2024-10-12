function viewProfile(body){
	this.element = $(body).find('#view-profile')[0];
	this.imgs = $(this.element).find('img');
	this.state = $(this.element).find('.state')[0];
	this.buttons = $(this.element).find('.button');
	this.texts = [];
	this.texts.push($( $(this.element).find('.name')[0] ).find('span')[0]);
	this.texts.push($(this.element).find('.username')[0]);
	this.texts.push($(this.element).find('.userbio')[0]);
	this.texts.push($(this.element).find('.followers')[0]);
	this.texts.push($(this.element).find('.following')[0]);
	this.texts.push($(this.element).find('.user-posts')[0]);
	this.texts.push($(this.element).find('.user-birth')[0]);
	this.texts.push($(this.element).find('.user-gender')[0]);
	this.texts.push($(this.element).find('.user-joined')[0]);
	this.texts.push($(this.element).find('.last-online')[0]);
	this.friend_grp = $(this.element).find('.fnd-grp-body')[0]
}

viewProfile.prototype.hide = function(){
	$(this.element).hide();
}

viewProfile.prototype.show = function(){
	$(this.element).show();
}



viewProfile.prototype.setProfile = function(uid){
	var ref = this;
	// app.update_friendList();
	// app.update_friendRequest();
	// app.update_following();	
	// //console.log(uid)
	$(ref.buttons[0]).hide();
	$(ref.buttons[1]).hide();
	database.ref('followers/' + uid).get().then(function(snapshot){
		var count = snapshot.numChildren();
		ref.texts[3].innerHTML = 'Followers : ' +  formatNumber(count);
	});
	database.ref('following/' + uid).get().then(function(snapshot){
		var count = snapshot.numChildren();
		ref.texts[4].innerHTML = 'Following : ' +  formatNumber(count);
	});
	
	
	database.ref('status/' + uid).get().then(function(snapshot){
		var val = snapshot.val();
		if(val.state == 'online'){
			$(ref.state).show();
			ref.texts[9].innerText = 'Last Online : Now';
		}
		else {
			$(ref.state).hide();
			ref.texts[9].innerText = 'Last Online : ' + getTimeDiffAndPrettyText(val.last_changed).friendlyNiceText;
		}
	})
	
	database.ref('users/' + uid).get().then(function(snapshot){
		var val = snapshot.val();
		//user info 'text
		ref.texts[0].innerHTML = '';
		ref.texts[0].innerText = formatName(val.name[0], val.name[1]);
		ref.texts[1].innerText = '@' + val.username;
		
		if(val.gender != null){
			let str = val.gender
			ref.texts[7].innerText = 'Gender : ' + (str.charAt(0).toUpperCase() + str.slice(1))
			if(val.gender == 'male') {
				$('#gender-icon-male').show()
				$('#gender-icon-female').hide()
			}
			else if(val.gender == 'female') {
				$('#gender-icon-male').hide()
				$('#gender-icon-female').show()
			}
		}
		
		if(val.accountCreated != null){
			ref.texts[8].innerText = 'Joined : ' + formatDate(val.accountCreated)
		}
		
		if(val.birth != null){
			ref.texts[6].innerText = 'Birthday : ' + formatDate(val.birth)
		}
		
		if(val.bio == null){
			ref.texts[2].innerHTML = '';
			$(ref.buttons[2]).hide();
			$(ref.texts[2]).hide();
		}
		else{
			ref.texts[2].innerHTML = '';
			if(val.bio.length <= 0){
				$(ref.buttons[2]).hide();
				$(ref.texts[2]).hide();
			}
			else{
				ref.texts[2].appendChild(parseHellocatString(val.bio))
				$(ref.texts[2]).show();
				if(val.bio.length > 255){
					$(ref.buttons[2]).show();
					ref.buttons[2].onclick = function(){
						$(ref.buttons[2]).hide();
						$(ref.texts[2]).removeClass("bottom-opacity");
					}
					$(ref.texts[2]).addClass("bottom-opacity");
				}
				else{
					$(ref.buttons[2]).hide();
					$(ref.texts[2]).removeClass("bottom-opacity");
				}
			}
		}
		
		//user profile pic
		ref.imgs[0].src = val.profile_picture;
		
		if(val.ranking != null){
			// ref.texts[5].innerHTML = '';
			$(ref.texts[5]).show();
			var img = new Image();
			if(val.ranking == 'vip'){
				img.src = '/res/icon/ranking/vip.svg';
				img.setAttribute('class', 'ranking vip');
			}
			else if(val.ranking == 'artist'){
				img.src = '/res/icon/ranking/artist.svg';
				img.setAttribute('class', 'ranking');
			}
			else{
				img.src = '/res/icon/ranking/user.svg';
				img.setAttribute('class', 'ranking');
			}
			ref.texts[0].appendChild(img);
			SVGInject(img);
		}
		else $(ref.imgs[1]).hide();
		
		
		
		//friendship button
		if(auth.currentUser.uid == uid){
			$(ref.buttons[1]).hide();
		}
		else{
			getRelationType(auth.getUid(), uid).then(function(e){
			    if(e.is_friend){
					$(ref.buttons[1]).show();
					$(ref.buttons[1]).addClass("button-active");
					ref.buttons[1].value = 'Unfriend'
					ref.buttons[1].onclick = function(){
						var ask = confirm(`Do you want to unfriend @${val.username}?`);
						if(ask){
							unfriendUser(auth.getUid(), uid).then(function(){
							    ref.setProfile(uid)
							});
						}
					}
				}
				else if(e.sent){
					$(ref.buttons[1]).show();
					$(ref.buttons[1]).removeClass("button-active");
					ref.buttons[1].value = 'Cancel'
					ref.buttons[1].onclick = function(){
						cancelFriendRequest(auth.getUid(), uid).then(function(){
							ref.setProfile(uid)
						})
					}
				}
				else if(e.recieved){
					$(ref.buttons[1]).show();
					$(ref.buttons[1]).removeClass("button-active");
					ref.buttons[1].value = 'Accept'
					ref.buttons[1].onclick = function(){
						acceptFriendRequest(auth.getUid(), uid).then(function(){
						    ref.setProfile(uid)
						})
					}
				}
				else {
					$(ref.buttons[1]).show();
					$(ref.buttons[1]).removeClass("button-active");
					ref.buttons[1].value = 'Add Friend'
					ref.buttons[1].onclick = function(){
						sendFriendRequest(auth.getUid(), uid).then(function(){
						    ref.setProfile(uid)
						})
					}					
				}
			})
			
		}
		
		
		//follow button
		if(auth.currentUser.uid == uid){
			$(ref.buttons[0]).hide();
		}
		else{
			database.ref('following/' + auth.getUid() + '/' + uid).get().then(function(p) {
				if(p.exists()) {
					$(ref.buttons[0]).show();
					$(ref.buttons[0]).addClass("button-active");
					ref.buttons[0].value = 'Unfollow'
					ref.buttons[0].onclick = function(){
						unfollow(uid, auth.getUid()).then(function(done){
							if(done) ref.setProfile(uid)						
						})
					}
				} 
				else {
					$(ref.buttons[0]).show();
					$(ref.buttons[0]).removeClass("button-active");
					ref.buttons[0].value = 'Follow'
					ref.buttons[0].onclick = function(){
						follow(uid, auth.getUid()).then(function(done){
							if(done) ref.setProfile(uid)						
						})
					}					
				}
			})
			
		}
		
	});
	
	// database.ref('posts/' + uid).get().then(function(e){
		// ref.texts[5].innerText = 'Total Posts : ' + e.numChildren()
	// });
	
	
	ref.friend_grp.innerHTML = ''
	database.ref('friendships/' + uid).orderByValue().get().then(function(e){
		// //console.log(e.numChildren())
		e.forEach(function(f){
		    database.ref('users/' + f.key).get().then(function(g){
			    const val = g.val()
				// //console.log(val)
				$(ref.friend_grp).append(`
					<img class="pic" src="${val.profile_picture}" height="32" width="32" alt="" />
				`)
			})
		})
	})
	
	
}

viewProfile.prototype.init = function(__ref){
	var ref = this;
}			