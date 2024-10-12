function hellocatHome(body){
	this.element = $(body).find('#home')[0];
	this.shortcuts = $(this.body).find('.badged-text');
	this.total_visited = $("#total-visited")
}

hellocatHome.prototype.hide = function(){
	$(this.element).hide(200);
}

hellocatHome.prototype.show = function(){
	$(this.element).show(200);
}

hellocatHome.prototype.update = function(){
	var ref = this
	database.ref("total_visited").get().then(function(e){
		ref.total_visited.text('Total Visited from 01/04/2024 10:52PM to now, ' + formatNumber(e.val() || 0) + " times!")
	})
}

hellocatHome.prototype.init = function(__ref){
	var ref = this;
	
}
