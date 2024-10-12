function emailVerify(){
	this.element = $('#verify-email');
	this.inputs = this.element.find('input');
	this.links = this.element.find('.link');
	this.h6s = this.element.find('h6');
	this.selects = this.element.find('select');
	this.is_changing_email = false
}

emailVerify.prototype.hide = function(dealy){
	$(this.element).hide(dealy);
}

emailVerify.prototype.show = function(dealy){
	$(this.element).show(dealy);
}

emailVerify.prototype.sendEmailVerification = function(){
	var ref = this
	if(auth.currentUser) {
		if(auth.currentUser.emailVerified == false) {
			auth.currentUser.sendEmailVerification().then(function(){
				localStorage.setItem("hc-ver-email-sent", auth.currentUser.email)
				ref.update()
				//console.log("sent")
			})
			.catch(function(err) {
				//console.log(err)
				alert(err)
			})
		}
	}
}

emailVerify.prototype.update = function(){
	var ref = this;
	if(auth.currentUser) {
		$(ref.inputs[0]).val(auth.currentUser.email)
		if(auth.currentUser.emailVerified == false && localStorage.getItem("hc-ver-email-sent") == auth.currentUser.email) {
			$(ref.h6s[0]).hide()
		}		
	}
}

emailVerify.prototype.init = function(__ref){
	var ref = this;
	$(ref.links[0]).click(function(e){
		if(auth.currentUser) {
			if(!(auth.currentUser.emailVerified == false && localStorage.getItem("hc-ver-email-sent") == auth.currentUser.email)) {
				ref.sendEmailVerification()
			}
		}
	});
	$(ref.inputs[1]).click(function(){
		if(ref.is_changing_email == false) {
			$(ref.inputs[0]).prop( "disabled", false);
			this.value = "Done?"
			ref.is_changing_email = true
		}
		else if(ref.is_changing_email == true) {
			let new_email = $(ref.inputs[0]).val()
			auth.currentUser.updateEmail(new_email).then(function(){
				$(ref.inputs[0]).prop( "disabled", true);
				$(ref.inputs[0]).val(new_email)
				$(ref.inputs[1]).val("Change Email?")
				ref.update
				localStorage.removeItem("hc-ver-email-sent")
				ref.is_changing_email = true
			})
			.catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.message
				$(ref.inputs[0]).prop( "disabled", true);
				$(ref.inputs[0]).val(auth.currentUser.email)
				$(ref.inputs[1]).val("Change Email?")
				console.warn("Error : " + errorMessage + ' : ' + errorCode)
				window.alert(errorMessage);	
				ref.is_changing_email = false
				ref.update()
			})
		}
	})
}