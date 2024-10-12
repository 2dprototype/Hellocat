function bodyPage(mainBody){
	this.element = $(mainBody).find('#body')[0];
	this.home = new hellocatHome(this.element);
	this.chats = new hellocatChatsList(this.element);
	this.friendList = new friendList(this.element);
	this.findFriends = new findFriends(this.element);
	this.viewProfile = new viewProfile(this.element);
}

bodyPage.prototype.hide = function(){
	$(this.element).hide();
}

bodyPage.prototype.show = function(){
	$(this.element).show();
}


bodyPage.prototype.init = function(__ref){
	var ref = this;
	
	ref.chats.show();
	ref.home.init(__ref);
	ref.chats.init(__ref);
	ref.friendList.init(__ref);
	ref.findFriends.init(__ref);
	ref.viewProfile.init(__ref);
	
	//on page scroll event
	ref.element.onscroll = function(){
		__ref.mainBody.adjustHeightOnScroll();
	}
	
}