function createProfile(){
	this.element = $('#create-profile');
	this.inputs = this.element.find('input');
	this.buttons = this.element.find('button');
	this.selects = this.element.find('select');
}

createProfile.prototype.hide = function(dealy){
	$(this.element).hide(dealy);
}

createProfile.prototype.show = function(dealy){
	$(this.element).show(dealy);
}

createProfile.prototype.init = function(__ref){
	var ref = this;
	var firstName, lastName, username, birth, gender;
	$(ref.buttons[0]).click(function(){
		//console.log(ref)
		firstName = ref.inputs[0].value
		lastName = ref.inputs[1].value
		username = ref.inputs[2].value
		birth = ref.inputs[3].value
		gender = ref.selects[0].value
		var uid = auth.getUid()
		firestore.collection("users").doc(uid).set({
			name : [firstName, lastName],
			birth : birth,
			gender : gender,
			bio : ''
		});
		//store user info at realtime database
		firebase.database().ref('users/' + uid).set({
			name : [firstName, lastName],
			birth : birth,
			gender : gender,
			bio : '',
			accountCreated : firebase.database.ServerValue.TIMESTAMP,
			theme : 'cat-drk'
		}).then(function(){
		    router.navigateTo('/')
		})
		//username
		database.ref('username/' + username).once("value").then(function(snapshot) {
			if(snapshot.exists()){
				var old_username = username;
				username = autoUserID(firstName, lastName);
				firebase.database().ref('username/' + username).set(uid);
				firebase.database().ref('users/' + uid).update({username : username});
				firestore.collection("users").doc(uid).update({username : username});
				alert(`The username "${old_username}" already exists. So, we set your username "${username}".`);
			}
			else{
				firebase.database().ref('username/' + username).set(uid);
				firebase.database().ref('users/' + uid).update({username : username});
				firestore.collection("users").doc(uid).update({username : username});
			}
		});
		//auto profile pic
		// firebase.database().ref('username/' + username).set(user.uid);
		//upload auto-profile at Storage
		var img_data = autoProfileImage(firstName[0] || '?');
		var st_ref = storage.ref('users/' + uid + '/profile.png');
		var progress_bar = new ProgressBar();
		var uploadTask = st_ref.putString(img_data, 'data_url');
		progress_bar.createInterface();
		uploadTask.then(function(snapshot){
			snapshot.ref.getDownloadURL().then(function(img_url){
				//set image link to firesotre
				firestore.collection("users").doc(uid).update({
					profile_picture : img_url
				}).then(function(){
					app.updateUserInfo(uid)
				});
				//set image link to realtime database
				firebase.database().ref('users/' + uid).update({
					profile_picture : img_url
				});	
				progress_bar.destroy();
			});
		});
		uploadTask.on('state_changed', function(data){
			var percent = (data.bytesTransferred/data.totalBytes) * 100 
			progress_bar.setPercent(percent);
		});
		//console.log('Account has created!');
		//push history
		setLoginHistory(HISTORY_TYPE.SIGNUP)
		router.navigateTo('/')
	})
}