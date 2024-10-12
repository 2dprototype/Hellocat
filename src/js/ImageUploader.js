function ImageUploader(){
	this.element = null;
	this.buttons = [];
	this.cropper = null;
	this.img = null;
	this.src = 'res/blank-profile.png';
	this.imgs = [];
}

ImageUploader.prototype.hide = function(){
	$(this.element).hide(200);
}

ImageUploader.prototype.show = function(){
	$(this.element).show(200);
}


ImageUploader.prototype.createInterface = function(upload_callback = function(){}){
	var ref = this;
	var page = `
		<div class="upload-image">
			<div class="header">
				<span class="title">Uploading Profile Picture</span></span>
				<img class="close" src="res/icon/x.svg" height="30" width="30"/>
			</div>
			<div class="body"></div>
			<div class="footer">
				<button class="choose-btn">Choose</button>
				<button class="update-btn">Update</button>
			</div>
		</div>
	`
	this.element = document.createElement('div');
	this.element.innerHTML = page;
	this.element.setAttribute('class', 'upload-image-bg');
	this.buttons = $(this.element).find('button');
	this.imgs = $(this.element).find('img');
	$('body').append(this.element);
	
	
	var body = $(ref.element).find('.body')[0];
	ref.img = new Image();
	ref.img.style.display = 'none';
	ref.img.src = ref.src;
	$(body).append(ref.img);
	ref.cropper = new Cropper(ref.img, {
		aspectRatio: 16 / 16,
	});
	
	
	$(ref.imgs[0]).click(function(){
		ref.destroy();
	});
	$(ref.buttons[0]).click(function(){
		ref.loadImage();
	});
	$(ref.buttons[1]).click(function(){
		upload_callback(ref);
	});
}

ImageUploader.prototype.loadImage = function(){
	var ref = this;
	var input = document.createElement('input');
	input.type = 'file';
	input.click();
	input.addEventListener('change', (e) => {
		if(e.target.files[0].name){
			var reader =  new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			reader.onload =  function(e){
				ref.src = e.target.result;
				ref.replace(ref.src);
			}
		}
	})
}

ImageUploader.prototype.getImageData = function(){
	var canvas = this.cropper.getCroppedCanvas({
		height : 512,
		width : 512
	});
	return canvas.toDataURL();
}

ImageUploader.prototype.replace = function(src){
	this.cropper.replace(src)
}

ImageUploader.prototype.destroy = function(){
	if(this.cropper != null) this.cropper.destroy();
	if(this.element != null) this.element.remove();
	
	this.cropper = null;
	this.element = null;
	this.img = null;
	this.src = 'res/blank-profile.png';
	this.buttons = [];
}