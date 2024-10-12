function loginAccount(){
	this.element = $('#login-account');
	this.inputs = this.element.find('input');
	this.buttons = this.element.find('button');
	// this.pages = this.element.find('.page');
	this.links = this.element.find('.link');
	this.imgs = this.element.find('img');
}

loginAccount.prototype.hide = function(){
	$(this.element).hide();
}

loginAccount.prototype.show = function(){
	$(this.element).show();
}

loginAccount.prototype.clear = function(){
	for (input of this.inputs) input.value = ""
}

loginAccount.prototype.init = function(__ref){
	var ref = this;
	var dealy = 500;
	
	$(ref.links[0]).click(function(e){
		router.navigateTo('signUp')
	});
}
