function settings(){
	this.element = $('#settings');
	this.profileSettings = new profileSettings(this.element);
	this.historySettings = new historySettings(this.element);
	this.themeSettings = new themeSettings(this.element);
	this.options_elm = this.element.find('#options');
	this.options = $(this.options_elm).find('.btn');
	this.closeButton = $($(this.element).find('#box-head')).find('.close-btn')[0];
}

settings.prototype.hide = function(){
	$(this.element).hide();
	this.hideAll()
}

settings.prototype.show = function(){
	$(this.element).show();
	this.hideAll()
	$(this.options_elm).show();
}

settings.prototype.hideAll = function(){
	$(this.options_elm).hide();
	this.profileSettings.hide();
	this.themeSettings.hide();
	this.historySettings.hide();
}


settings.prototype.init = function(__ref){
	var ref = this;
	ref.profileSettings.init(__ref);
	ref.historySettings.init(__ref);
	ref.themeSettings.init(__ref);
	
	//toggle profileSettings
	$(ref.options[0]).click(function(){
		router.navigateTo('settings/profile');
	});
	//toggle historySettings
	$(ref.options[1]).click(function(){
		router.navigateTo('settings/history');
	});
	//toggle themeSettings
	$(ref.options[2]).click(function(){
		router.navigateTo('settings/theme');
	});
	//toggle mainBody
	$(ref.closeButton).click(function(){
		ref.hide();
		ref.profileSettings.clear();		
		ref.profileSettings.hide();
		ref.hideAll()
		router.navigateTo('/')
		__ref.mainBody.show();
	});
	
	
}
