// Firebase configuration
const firebase_config = {
	apiKey: "YOUR_API_KEY",
	authDomain: "YOUR_AUTH_DOMAIN",
	databaseURL: "YOUR_DATABASE_URL",
	projectId: "YOUR_PROJECT_ID",
	storageBucket: "YOUR_STORAGE_BUCKET",
	messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
	appId: "YOUR_APP_ID"
}

// Initialize Firebase
firebase.initializeApp(firebase_config);

const database = firebase.database();
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage()

const router = new Router({
    mode: 'history',
    page404: function (path) {
        //console.log('"/' + path + '" Page not found');
	}
});

const app = new App();
app.init();

window.onresize = function(e){
	app.mainBody.adjustHeightOnScroll(app);
	app.chat_ui.adjustFooter();
}

window.onload = function(){
	updateVisited()
}

router.add('/', function () {
	app.settings.hide();
	app.chat_ui.hide();
	app.loginAccount.hide()
	app.createAccount.hide()
	app.emailVerify.hide()
	app.createProfile.hide()
	app.mainBody.show();
});

router.add('u/(:any)', function (uid) {
    app.viewProfileWithUID(uid)
	app.emailVerify.hide();
	app.settings.hide();
});

router.add('settings/(:any)', function (p) {
	app.chat_ui.hide();
	app.loginAccount.hide()
	app.createAccount.hide()
	app.emailVerify.hide()
	app.createProfile.hide()
	app.mainBody.hide();
	app.settings.show();
	if(p == 'history') {
		app.settings.historySettings.show();
		app.settings.historySettings.loadLoginHistory();
		$(app.settings.options_elm).hide();
	}
	else if(p == 'profile'){
		app.settings.profileSettings.show();
		app.settings.profileSettings.getUserData();
		$(app.settings.options_elm).hide();
	}
	else if(p == 'theme'){
		app.settings.themeSettings.show();
		$(app.settings.options_elm).hide();
	}
	else {
		router.navigateTo('settings');
	}
});

router.add(/@[a-z0-9_-]+/gm, function (uname) {
	var str = this.uri.slice(1, this.uri.length)
    app.viewProfileWithUsername(str)
	app.settings.hide();
});

router.add('about', function () {
	app.loginAccount.hide()
	app.createAccount.hide()
	app.emailVerify.hide()
	app.createProfile.hide()
	app.chat_ui.hide();
	app.mainBody.show()
	app.mainBody.openHome();
	app.mainBody.body.chats.update();
	app.settings.hide();
});

router.add('chats', function () {
	app.chat_ui.hide();
	app.loginAccount.hide()
	app.createAccount.hide()
	app.emailVerify.hide()
	app.createProfile.hide()
	app.mainBody.show()
	app.mainBody.openChats();
	app.mainBody.body.chats.update();
	app.settings.hide();
});


// router.add('l/(:any)', function (id) {
	// console.log(id)
	// database.ref('links/' + id).get().then(function(e) {
		// window.open(e.val().url, "_self")
	// })
// });

router.add('inbox/(:any)', function (fid) {
	app.mainBody.hide();
	app.settings.hide();
	app.chat_ui.show();
	app.chat_ui.update_by_fid(fid)
	app.settings.hide();
});

router.add('c/(:any)', function (cid) {
	app.mainBody.hide();
	app.settings.hide();
	app.chat_ui.show();
	app.chat_ui.update_by_cid(cid)
	app.settings.hide();
});


router.add('profile', function () {
	app.chat_ui.hide();
	app.mainBody.openViewProfile();
	app.mainBody.body.viewProfile.setProfile(auth.getUid())
	app.settings.hide();
});

router.add('friends', function () {
	app.chat_ui.hide();
	app.mainBody.openFriendList();
	app.mainBody.body.friendList.updateFriendLists()
	app.settings.hide();
});

router.add('findFriends', function () {
	app.chat_ui.hide();
	app.mainBody.openFindFriends();
	app.mainBody.body.findFriends.updateUserLists();
	app.settings.hide();
});

router.add('settings', function () {
	app.mainBody.hide();
	app.chat_ui.hide();
	app.settings.show();
});

router.add('emailVerification', function () {
	app.mainBody.hide();
	app.createAccount.hide();
	app.loginAccount.hide();
	app.settings.hide();
	app.emailVerify.show()
	app.createProfile.hide()
});

router.add('createProfille', function () {
	app.mainBody.hide();
	app.chat_ui.hide();
	app.createAccount.hide();
	app.loginAccount.hide();
	app.settings.hide();
	app.emailVerify.hide()
	app.createProfile.show()
});

router.add('signIn', function () {
	app.mainBody.hide();
	app.chat_ui.hide();
	app.createAccount.hide();
	app.loginAccount.show();
	app.settings.hide();
	app.emailVerify.hide()
	app.createProfile.hide()
});

router.add('signUp', function () {
	app.mainBody.hide();
	app.createAccount.show();
	app.chat_ui.hide();
	app.loginAccount.hide();
	app.settings.hide();
	app.emailVerify.hide()
	app.createProfile.hide()
});

router.add('signOut', function () {
	app.signOut();
	router.navigateTo('signIn')
});

router.addUriListener();

document.addEventListener('visibilitychange', function (event) {
    app.chat_ui.onvisibilitychange(event)
});