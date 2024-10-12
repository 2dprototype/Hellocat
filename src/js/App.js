function App(){
	this.createAccount = new createAccount();
	this.loginAccount = new loginAccount();
	this.createProfile = new createProfile();
	this.emailVerify = new emailVerify();
	this.chat_ui = new chat_ui();
	this.settings = new settings();
	this.mainBody = new mainBody();
	this.theme = new theme();
	
	this.currentSession = null;
	this.version = 'HELLOCAT_WEB-v1.0.0'
}

App.prototype.viewProfileWithUsername = function(username){
	var ref = this;
	firebase.database().ref('username/' + username).get().then(function(e) {
		if(e.exists()){
			var uid = e.val();
			ref.mainBody.openViewProfile();
			ref.mainBody.body.viewProfile.setProfile(uid);
		}
		else{
			//console.log(`We did't find "${username}".`);
		}
	});
}

App.prototype.viewProfileWithUID = function(uid){
	var ref = this;
	ref.mainBody.openViewProfile();
	ref.mainBody.body.viewProfile.setProfile(uid);
}

App.prototype.setThemeToDatabase = function(index){
	var __theme = theme.themes[index];
	if(__theme != undefined){
		firebase.database().ref('users/' + auth.currentUser.uid).update({
			theme : index
		});	
		if(__theme.ext == 'lst') this.theme.loadAsLST(__theme.src);
		else if(__theme.ext == 'json') //console.log(__theme);
		localStorage.setItem("app-theme", __theme.i);
		this.settings.themeSettings.selects[0].value = index;
		this.theme.current = index
	}
}

App.prototype.setTheme = function(index){
	var __theme = theme.themes[index];
	if(__theme != undefined){
		if(__theme.ext == 'lst') this.theme.loadAsLST(__theme.src);
		else if(__theme.ext == 'json') //console.log(__theme);
		localStorage.setItem("app-theme", __theme.i);
		this.settings.themeSettings.selects[0].value = index;
	}
}


App.prototype.signOut = function(){
	database.ref('status/' + auth.getUid()).off('child_changed')
	database.ref('status/' + auth.getUid()).update({
		state: 'offline',
		last_changed: firebase.database.ServerValue.TIMESTAMP,
		ua : window.navigator.userAgent
	})
	auth.signOut();
}

App.prototype.login = function(){
	var email = this.loginAccount.inputs[0].value;
	var password = this.loginAccount.inputs[1].value;
	
	if (!email.includes("@")) email += "@gmail.com"
	
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(e){
		if(e.user.emailVerified) setLoginHistory(HISTORY_TYPE.SIGNIN)
	})
	.catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message
		console.warn("Error : " + errorMessage + ' : ' + errorCode)
		window.alert(errorMessage);
	});
}

App.prototype.updateUserInfo = function(user){
	var ref = this;
	var docRef = firestore.collection("users").doc(user);
	docRef.get().then(function(doc){
		if(doc.exists){
			var data = doc.data();
			if(data.profile_picture != undefined){ 
				ref.mainBody.head.imgs[0].src = data.profile_picture;
			};
			var name = data.name[0] + ' ' + data.name[1];
			ref.mainBody.head.spans[0].innerText = name;
		} 
		else{
			//console.log("No such document!");
		}
	}).catch((error) => {
		//console.log("Error getting document:", error);
	});
}


App.prototype.update_activeStatus = function(user){
	//update active status
	var userStatusDatabaseRef = firebase.database().ref('/status/' + user.uid);
	var isOfflineForDatabase = {
		state: 'offline',
		last_changed: firebase.database.ServerValue.TIMESTAMP,
		ua : window.navigator.userAgent
	};
	var isOnlineForDatabase = {
		state: 'online',
		last_changed: firebase.database.ServerValue.TIMESTAMP,
		ua : window.navigator.userAgent
	};
	firebase.database().ref('.info/connected').on('value', function(snapshot) {
		if (snapshot.val() == false) {
			return;
		};
		userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
			userStatusDatabaseRef.set(isOnlineForDatabase);
		});
	});
}



App.prototype.init = function(){
	var ref = this;
	var dealy = 500;
	
	ref.mainBody.resize();
	
	if(localStorage.getItem("app-theme") !== null){
		var i = localStorage.getItem("app-theme");
		ref.setTheme(i);
	}
	else{
		ref.setTheme('def-lht');
	}
	
	//init pages
	ref.createProfile.init(this);
	ref.createAccount.init(this);
	ref.loginAccount.init(this);
	ref.chat_ui.init(this);
	ref.settings.init(this);
	ref.mainBody.init(this);
	ref.emailVerify.init(this);
	
	//firebase login stage change event
	auth.onAuthStateChanged(function(user) {
		if (user) {
			if(user.emailVerified) {
				database.ref("users/" + auth.getUid()).get().then(function (e) {
					if  (e.exists()) {
						ref.update_activeStatus(user);
						//update from realtime database
						firebase.database().ref('users/' + user.uid).get().then(function(e){
							var val = e.val();
							if(val.theme != undefined){
								ref.setTheme(val.theme);
								localStorage.setItem("app-theme", val.theme);
							}
						});
						
						database.ref('status/' + user.uid).on('child_changed', function(e){
							var val = e.val();
							var key = e.key;
							if(key == 'state') {
								if(val == 'offline'){
									database.ref('status/' + user.uid).update({
										state: 'online',
										last_changed: firebase.database.ServerValue.TIMESTAMP,
										ua : window.navigator.userAgent
									})
								}
							}
						})
						
						ref.mainBody.show();
						ref.loginAccount.hide();
						ref.createProfile.hide();
						ref.emailVerify.hide();
						ref.createAccount.hide();
						ref.chat_ui.hide();
						ref.updateUserInfo(user.uid)
						const path_name = window.location.pathname;
						const path_arr = path_name.split('/');
						// //console.log(path_name)
						// //console.log(path_arr)
						if(path_name == '/signIn' || path_name == '/signUp' || path_name == '/createProfille' || path_name == '/emailVerification' || path_name == '/'){
							router.navigateTo('/chats');
						}
						else if (path_arr.length > 2) {
							if(path_arr[1] == 'x' || 
								path_arr[1] == 'dec' || 
								path_arr[1] == 'enc' || 
								path_arr[1] == 'l' || 
								path_arr[1] == 'u' || 
								path_arr[1] == 'settings' || 
								path_arr[1] == 'inbox' || 
								path_arr[1] == 'c'){
								router.navigateTo(window.location.pathname);	
							}
						}
						else {
							router.navigateTo(window.location.pathname);	
						}
					}
					else {
						router.navigateTo('/createProfille')
					}
				})
			}
			else {
				// ref.mainBody.hide();
				// ref.createAccount.hide();
				// ref.loginAccount.hide();
				router.navigateTo('/emailVerification')
				ref.emailVerify.update();
			}
		} 
		else {
			// ref.mainBody.hide();
			// ref.emailVerify.hide();
			// ref.createAccount.hide();
			// ref.loginAccount.hide();
			router.navigateTo('/signIn')
		}
		ref.loginAccount.clear()
	});
	
	//login button event
	$(ref.loginAccount.buttons[0]).click(function(e){
		ref.login();
	});
	$(ref.loginAccount.inputs[0]).keypress(function (e) {
		if(e.which == 13) {
			ref.loginAccount.inputs[1].focus()
		}
	}); 
	$(ref.loginAccount.inputs[1]).keypress(function (e) {
		if(e.which == 13) ref.login()
	});   
	
}

