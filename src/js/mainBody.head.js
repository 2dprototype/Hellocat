function headBar(mainBody){
	this.element = $(mainBody).find('.head')[0];
	
	this.imgs = [];
	this.imgs.push($(this.element).find('.profile-pic')[0]);
	// this.imgs.push($(this.element).find('.notification')[0]);
	this.imgs.push($(this.element).find('.menu')[0]);
	// this.imgs.push($(this.element).find('.add')[0]);

	this.spans = $(this.element).find('span');
	this.sidenav =  $(this.element).find('.side-nav')[0];
	this.closenav = $(this.sidenav).find('.close-btn')[0];
	this.nav_a = $(this.sidenav).find('.a');
}

headBar.prototype.hide = function(){
	$(this.element).hide();
}

headBar.prototype.show = function(){
	$(this.element).show();
}

headBar.prototype.init = function(__ref){
	var ref = this;
	//profile icon
	// $(this.imgs[0]).click(function(){
		// router.navigateTo('/profile');
	// });
	
	
	//show nav
	$(this.imgs[0]).click(function(){
		ref.show_sidenav();
	});
	
	
	//hide nav
	$(this.closenav).click(function(){
		ref.hide_sidenav();
	});
	
	//show - home
	$(this.nav_a[6]).click(function(){
		router.navigateTo('/about');
		ref.hide_sidenav();
	});
	
	//show - chats
	$(this.nav_a[0]).click(function(){
		router.navigateTo('/chats');
		ref.hide_sidenav();
	});
	
	
	
	//show - viewProfile
	$(this.nav_a[1]).click(function(){
		router.navigateTo('/profile');
		ref.hide_sidenav();
	});
	
	//show - friendList
	$(this.nav_a[2]).click(function(){
		router.navigateTo('/friends');
		ref.hide_sidenav();
	});
	//show - findFriends
	$(this.nav_a[3]).click(function(){
		router.navigateTo('/findFriends');
		ref.hide_sidenav();
	});
	
	//show - settings
	$(this.nav_a[4]).click(function(){
		router.navigateTo('/settings');
		ref.hide_sidenav();
	});
	
	//show - signOut
	$(this.nav_a[5]).click(function(){
		var ask = confirm(`Do you want to sign out from Hellocat?`);
		if(ask) __ref.signOut();
		ref.hide_sidenav();
	});
}

headBar.prototype.show_sidenav = function(){
	this.sidenav.style.width = "250px";
}
headBar.prototype.hide_sidenav = function(){
	this.sidenav.style.width = "0";
}