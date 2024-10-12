function createAccount(){
	this.element = $('#create-account');
	this.inputs = this.element.find('input');
	this.buttons = this.element.find('button');
	this.pages = this.element.find('.page');
	this.links = this.element.find('.link');
	this.imgs = this.element.find('.img');
	this.selects = this.element.find('select');
}

createAccount.prototype.hide = function(dealy){
	$(this.element).hide(dealy);
}

createAccount.prototype.show = function(dealy){
	$(this.element).show(dealy);
}

createAccount.prototype.clear = function(){
	for (input of this.inputs) input.value = ""
}

createAccount.prototype.init = function(__ref){
	var ref = this;
	var dealy = 500;
	
	$(ref.links[0]).click(function(e){
		router.navigateTo('signIn')
	});
	
	$(ref.buttons[0]).click(function(){
		let email = ref.inputs[0].value
		let password = ref.inputs[1].value
		let c_password = ref.inputs[2].value
		// //console.log(`${email} : ${password}`)
		if (password == c_password) {
			auth.createUserWithEmailAndPassword(email, password).then(function(){
				__ref.emailVerify.sendEmailVerification()
			})
		}
		else {
			alert("Password did not confirmed!")
		}
	})
	
	}	