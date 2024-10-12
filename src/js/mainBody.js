function mainBody(){
	this.element = $('#main-body');
	this.head = new headBar(this.element);
	this.body = new bodyPage(this.element);
}

mainBody.prototype.openHome = function(){
	this.body.home.show();
	this.body.chats.hide();
	this.body.friendList.hide();
	this.body.findFriends.hide();
	this.body.viewProfile.hide();
	this.body.home.update()
	this.adjustHeightOnScroll();
}


mainBody.prototype.openChats = function(){
	this.body.home.hide();
	this.body.chats.show();
	this.body.friendList.hide();
	this.body.findFriends.hide();
	this.body.viewProfile.hide();
	this.adjustHeightOnScroll();
}


mainBody.prototype.openViewProfile = function(){
	this.body.home.hide();
	this.body.chats.hide();
	this.body.friendList.hide();
	this.body.findFriends.hide();
	this.body.viewProfile.show();
	this.adjustHeightOnScroll();
}

mainBody.prototype.openFriendList = function(){
	this.body.home.hide();
	this.body.chats.hide();
	this.body.friendList.show();
	this.body.friendList.reset();
	this.body.findFriends.hide();
	this.body.viewProfile.hide();
	this.adjustHeightOnScroll();
}

mainBody.prototype.openFindFriends = function(){
	this.body.home.hide();
	this.body.chats.hide();
	this.body.friendList.hide();
	this.body.findFriends.show();
	this.body.viewProfile.hide();
	this.adjustHeightOnScroll();
}

mainBody.prototype.openSettings = function(){
	// this.body.friendList.hide();
	// this.body.findFriends.hide();
	// this.body.viewProfile.hide();
}


mainBody.prototype.resize = function(){
	var head = this.head.element;
	var body = this.body.element;
	
	$(body).height( window.innerHeight - $(head).height() )
}
mainBody.prototype.hide = function(){
	$(this.element).hide();
}

mainBody.prototype.show = function(){
	$(this.element).show();
}

mainBody.prototype.init = function(__ref){
	var ref = this;
	this.body.init(__ref);
	this.head.init(__ref);
}

mainBody.prototype.adjustHeightOnScroll = function(__ref){
	var ref = this;
	if(ref.body.element.scrollTop > ref.head.element.offsetHeight * 2){
		ref.head.hide();
		ref.body.element.style.top = '0px';
		ref.body.element.style.height = `${window.innerHeight}px`;
	}
	else{
		ref.head.show();
		ref.body.element.style.top =  "60px";
		ref.body.element.style.height = `${window.innerHeight - 60}px`;
		// ref.body.element.style.height = window.innerHeight - ref.head.element.offsetHeight;
	}
}