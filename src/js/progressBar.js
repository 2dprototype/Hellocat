function ProgressBar(){
	this.element = null;
	this.components = [];
	this.percent = 0;
}

ProgressBar.prototype.hide = function(){
	$(this.element).hide(200);
}

ProgressBar.prototype.show = function(){
	$(this.element).show(200);
}

ProgressBar.prototype.setPercent = function(val){
	this.percent = val;
	this.components[1].style.width = parseInt(this.percent) + '%';
	if(this.percent > 0) this.components[2].innerText = parseInt(this.percent) + '%';
}

ProgressBar.prototype.destroy = function(){
	if(this.element != null) this.element.remove();
	this.element = null;
	this.components = [];
	this.percent = 0;
}

ProgressBar.prototype.createInterface = function(){
	var ref = this;
	var page = 	`
		<div class="progress-bar">
			<div class="progress">
				<div class="bar" style="width:0">
					<p class="percent"></p>
				</div>
			</div>
		</div>
	`
	this.element = document.createElement('div');
	this.element.innerHTML = page;
	this.element.setAttribute('class', 'progress-bar-bg');
	
	this.components.push( $(this.element).find('.progress')[0] );
	this.components.push( $(this.element).find('.bar')[0] );
	this.components.push( $(this.element).find('.percent')[0] );
	
	$('body').append(this.element);
}



function UploadProgressBar(){
	this.element = null;
	this.components = [];
	this.percent = 0;
}

UploadProgressBar.prototype.hide = function(){
	$(this.element).hide(200);
}

UploadProgressBar.prototype.show = function(){
	$(this.element).show(200);
}

UploadProgressBar.prototype.setPercent = function(val){
	this.percent = val;
	this.components[1].style.width = parseInt(this.percent) + '%';
	if(this.percent > 0) this.components[2].innerText = parseInt(this.percent) + '%';
}

UploadProgressBar.prototype.destroy = function(){
	if(this.element != null) this.element.remove();
	this.element = null;
	this.components = [];
	this.percent = 0;
}

UploadProgressBar.prototype.createInterface = function(elm){
	var ref = this;
	var page = 	`
		<div class="content">
			<div class="_body">
				<div class="upload-bar">
					<div class="title"></div>
					<div class="progress">
						<div class="bar" style="width:0">
							<p class="percent"></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	`
	this.element = document.createElement('div');
	this.element.innerHTML = page;
	this.element.setAttribute('class', 'msg msg-send');
	
	this.components.push( $(this.element).find('.progress')[0] );
	this.components.push( $(this.element).find('.bar')[0] );
	this.components.push( $(this.element).find('.percent')[0] );
	this.components.push( $(this.element).find('.title')[0] );
	
	elm.append(this.element);
}