function WebCamUI() {
	this.element = null;
	this.cropper = null;
	this.close_btn = null
	this.body = null;
	this.img_data = null;
	this.mode = 'camera'
	this.modes = [
		'camera',
		'crop',
		'view'
	]
	this.buttons = [];
	this.WebImageEditor = new WebImageEditor();
}

WebCamUI.prototype.hide = function () {
	$(this.element).hide(200);
}

WebCamUI.prototype.show = function () {
	$(this.element).show(200);
}


WebCamUI.prototype.createInterface = function (callback = function(){}) {
	var ref = this;
	
	this.element = $(`
		<div class="web-cam-ui-bg">
		<div class="web-cam-ui">
		<div class="header">
		<span class="title">Webcam</span>
		<div class="close-btn">
		<img onload="SVGInject(this)" class="close" src="/res/icon/x.svg" height="30" width="30"/>
		</div>
		</div>
		<div class="body">
		<div class="camera"></div>
		<img src="#" alt="" class="result" />
		</div>
		<div class="footer">
		<button class="btn">
		<img onload="SVGInject(this)" src="/res/icon/fill/photo_camera.svg" width="18" height="18"/>
		</button>
		<button class="btn">
		<img onload="SVGInject(this)" src="/res/icon/arrow-repeat.svg" width="18" height="18"/>
		</button>
		<button class="btn">
		<img onload="SVGInject(this)" src="/res/icon/pencil-square.svg" width="18" height="18"/>
		</button>
		</button>
		<button class="btn">
		<img onload="SVGInject(this)" src="/res/icon/WebImageEditor/bi-upload.svg" width="18" height="18"/>
		</button>
		</div>
		</div>
		</div>
	`)
	$('body').append(this.element)
	
	this.buttons = $(this.element).find('button');
	this.close_btn = $(this.element).find('.close-btn')[0];
	this.body = $(this.element).find('.body')[0];
	this.camera = $(this.body).find('.camera')[0];
	this.result = $(this.body).find('.result')[0];
	$(ref.result).hide()
	
	let height = 240*2;
	let width = 320*2;
	
	if(window.innerHeight > window.innerWidth){
		height = 320*2
		width = 240*2
	}
	
	let options = {
		width: width,
		height: height,
		dest_width: width,
		dest_height: height,
		image_format: 'png',
		jpeg_quality: 100,
		flip_horiz: true
	}
	
	Webcam.set(options);
	Webcam.attach( this.camera );
	
	$(ref.close_btn).click(function () {
		ref.destroy();
	});
	
	$(ref.buttons[0]).click(function () {
		if(ref.mode != 'crop'){
			if(ref.mode == 'camera'){
				Webcam.snap(function(data_uri) {
					ref.result.src = data_uri
					ref.img_data = data_uri
				});
				$(ref.camera).hide()
				$(ref.result).show()
				ref.mode = 'view'
			}
			else if(ref.mode == 'view') {
				$(ref.camera).show()
				$(ref.result).hide()
				ref.mode = 'camera'
			}
		}
	});
	$(ref.buttons[2]).click(function () {
		if(ref.mode != 'camera'){
			ref.WebImageEditor.createInterface(function(e){
				ref.img_data = e.getImageData()
				ref.result.src = ref.img_data
				ref.mode = 'view'
				e.destroy()
			})
			ref.WebImageEditor.replaceImage(ref.result.src)
			$(ref.WebImageEditor.buttons[0]).hide()
		}
	});
	$(ref.buttons[1]).click(function () {
		Webcam.set('constraints',{
			facingMode: "environment"
		});
		//console.log(Webcam)
	});
	$(ref.buttons[3]).click(function () {
		callback(ref)
	});
	
}


WebCamUI.prototype.loadFile = function (url, type, ext){
	var ref = this;
	if(ext == 'txt'){
		fetch_as_text(url, function(text){
			ref.body.innerHTML = text
		})
	}
	else {
		fetch_as_text(url, function(text){
			ref.body.innerHTML = text
		})
	}
}

WebCamUI.prototype.destroy = function () {
	if (this.element != null) this.element.remove();
	this.element = null;
	this.close_btn = null
	this.body = null;
	this.buttons = [];
	if(this.cropper != null) this.cropper.destroy()
	Webcam.reset()
}
