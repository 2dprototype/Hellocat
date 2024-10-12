function WebImageEditor() {
	this.selectedFilter = 0;
	this.element = null;
	this.buttons = [];
	this.canvas = null;
	this.img_name = '';
	this.img_data = null
	this.caman = null;
	this.cropper = null;
	this.cropper_options = {}
	this.ctx = null;
	this.src = '/res/blank-profile.png';
	this.close_btn = null;
	this.STATE = 0
	this.a_height = 255
	this.a_width = 255
}

WebImageEditor.prototype.STATE_DEFAULT = 0
WebImageEditor.prototype.STATE_CROPPER = 1
WebImageEditor.prototype.STATE_FILTER = 2
WebImageEditor.prototype.STATE_DRAW = 3

WebImageEditor.filters = [
	{
		"name": "Blur",
		"data": {
			"sepia": [30],
			"saturation": [3],
			"gamma": [1.4],
			"clip": [1],
			"stackBlur": [5]
		}
	},
	{
		"name": "Colorize",
		"data": {
			"colorize": ["#4090D5", 20]
		}
	},
	{
		"name": "Invert",
		"data": {
			"invert": [null]
		}
	},
	{
		"name": "SunRise",
		"data": {
			"exposure" : [3.5],
			"saturation" : [-5],
			"vibrance" : [50],
			"sepia" : [60],
			"colorize" : ["#e87b22", 10],
			"channels" : [ { red: 8, blue: 8 } ],
			"contrast" : [5],
			"gamma" : [1.2],
			"vignette" : ["55%", 25]
		}
	}
]



WebImageEditor.prototype.setFilter = function (img, filter) {
	Caman(img, function () {
		this.canvas.style.height = '100%'
		this.canvas.style.width = 'auto'
		var keys = Object.keys(filter);
		var values = Object.values(filter);
		for (k = 0; k < keys.length; k++) {
			var key = keys[k];
			var value = values[k];
			if (!(this[key] == undefined)) this[key](...value);
		}
		this.render();
	});
}

WebImageEditor.prototype.applyFilterByIndex = function (i) {
	if (-1 < i && i < WebImageEditor.filters.length) {
		var filter = WebImageEditor.filters[i].data;
		var ref = this;
		ref.applyFilter(filter);
		} else {
		alert('Invalid Image Filter!')
	}
}

WebImageEditor.prototype.applyFilter = function (filter) {
	var ref = this;
	var keys = Object.keys(filter);
	var values = Object.values(filter);
	for (k = 0; k < keys.length; k++) {
		var key = keys[k];
		var value = values[k];
		this.caman[key](...value)
	}
	this.caman.render()
}

WebImageEditor.prototype.hide = function () {
	$(this.element).hide(200);
}

WebImageEditor.prototype.show = function () {
	$(this.element).show(200);
}

WebImageEditor.prototype.createInterface = function (upload_callback = function () {}, load_mode = 0) {
	var ref = this;
	var page = `
	<div class="edit-image">
	<div class="header">
	<span class="title">Image Editor</span></span>
	<div class="close-btn">
	<img onload="SVGInject(this)" class="close" src="/res/icon/x.svg" height="30" width="30"/>
	</div>
	</div>
	<div class="body">
	<canvas></canvas>
	</div>
	<div class="sub-body">
	<div class="editing">
	
	</div>
	<div class="filters-div"></div>
	</div>
	<div class="footer">
	<button class="btn">
	<img onload="SVGInject(this)" src="/res/icon/WebImageEditor/bi-file-earmark-image.svg" width="18" height="18"/>
	</button>
	<button class="btn">
	<img onload="SVGInject(this)" src="/res/icon/WebImageEditor/bi-arrow-counterclockwise.svg" width="18" height="18"/>
	</button>
	<button class="btn">
	<img onload="SVGInject(this)" src="/res/icon/magic.svg" width="18" height="18"/>
	</button>
	<button class="btn">
	<img onload="SVGInject(this)" src="/res/icon/WebImageEditor/bi-crop.svg" width="18" height="18"/>
	</button>
	<button class="btn">
	<img onload="SVGInject(this)" src="/res/icon/WebImageEditor/bi-upload.svg" width="18" height="18"/>
	</button>
	</div>
	</div>
	`
	this.element = document.createElement('div');
	this.element.innerHTML = page;
	this.element.setAttribute('class', 'edit-image-bg');
	this.buttons = $(this.element).find('button');
	this.close_btn = $(this.element).find('.close-btn')[0]
	$('body').append(this.element);
	
	
	this.sub_body = $(ref.element).find('.sub-body')[0];
	this.filters_div = $(ref.element).find('.filters-div')[0];
	$(this.filters_div).hide()
	let ul = document.createElement('ul')
	for (i = 0; i < WebImageEditor.filters.length; i++) {
		var filter = WebImageEditor.filters[i];
		var id = 'filter_' + i;
		var li = document.createElement('li');
		var input = document.createElement('input');
		input.type = 'radio';
		input.setAttribute('name', 'test');
		input.setAttribute('id', id);
		input.setAttribute('value', i);
		input.onclick = function () {
			ref.selectedFilter = parseInt(this.value);
		}
		var label = document.createElement('label');
		label.setAttribute('for', id);
		var img = new Image();
		img.src = "/res/demo.png";
		ref.setFilter(img, filter.data);
		label.appendChild(img);
		li.appendChild(input);
		li.appendChild(label);
		ul.appendChild(li);
	}
	this.filters_div.appendChild(ul)
	
	this.body = $(ref.element).find('.body')[0];
	this.canvas = $(this.body).find('canvas')[0];
	
	// ref.img = new Image();
	// ref.img.style.display = 'none';
	// ref.img.src = ref.src;
	// $(body).append(ref.img);
	
	$(ref.close_btn).click(function () {
		ref.destroy();
	});
	
	$(ref.buttons[0]).click(function () {
		if (load_mode == 1) ref.loadImage1();
		else  ref.loadImage0();
	});
	$(ref.buttons[1]).click(function () {
		// var ctx = ref.canvas.getContext('2d');
		// ctx.fillStyle = 'blue';
		// ctx.fillRect(5, 5, ref.canvas.width - 10, ref.canvas.height / 2);
		// ctx.fillStyle = 'red';
		// ctx.beginPath();
		// ctx.arc(100, 75, 50, 0, 2 * Math.PI);
		// ctx.fill();
		// ref.startCaman(ref.canvas.toDataURL())
		if(ref.STATE == ref.STATE_DEFAULT) {
			if(ref.img_data) ref.startCaman(ref.img_data)
		}
		
	});
	$(ref.buttons[2]).click(function () {
		if(ref.STATE == ref.STATE_FILTER) {
			ref.STATE = ref.STATE_DEFAULT
			ref.applyFilterByIndex(ref.selectedFilter);
			$(ref.filters_div).hide()
			$(this).removeClass('active')
		}
		else if(ref.STATE == ref.STATE_DEFAULT) {
			ref.STATE = ref.STATE_FILTER
			$(ref.filters_div).show()
			$(this).addClass('active')
		}
	});
	$(ref.buttons[3]).click(function () {
		if (ref.STATE == ref.STATE_CROPPER && load_mode == 1) {
			
			let canvas = ref.cropper.getCroppedCanvas({
				height : ref.a_height,
				width : ref.a_width
			})
			let d = canvas.toDataURL()
			ref.img_data = d
			ref.startCaman(d)
			ref.cropper.destroy()
			ref.STATE = ref.STATE_DEFAULT
			$(this).removeClass('active')
			load_mode = 0
		}
		else if(ref.STATE == ref.STATE_CROPPER) {
			let canvas = ref.cropper.getCroppedCanvas({
				height : ref.a_height,
				width : ref.a_width
			})
			ref.startCaman(canvas.toDataURL())
			ref.cropper.destroy()
			ref.STATE = ref.STATE_DEFAULT
			$(this).removeClass('active')
		}
		else if(ref.STATE == ref.STATE_DEFAULT) {
			ref.startCropper()
			ref.STATE = ref.STATE_CROPPER
			$(this).addClass('active')
		}
	});
	$(ref.buttons[4]).click(function () {
		if(ref.STATE == ref.STATE_DEFAULT) {
			upload_callback(ref);
		}
		else {
			alert("Please finish editing first.")
		}
	});
}

WebImageEditor.prototype.resetImage = function(){
	//console.log('reset')
}

WebImageEditor.prototype.loadImage1 = function () {
	var ref = this;
	var input = document.createElement('input');
	input.type = 'file';
	input.setAttribute('accept', "image/*")
	input.click();
	input.addEventListener('change', function (e) {
		if (e.target.files[0].name) {
			let file = e.target.files[0]
			var reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			ref.img_name = e.target.files[0].name;
			reader.onload = function (f) {
				// ref.img_data = f.target.result
				let img = new Image()
				img.src = f.target.result
				img.style.display = 'none';
				$(ref.canvas).hide()
				$(ref.body).append(img)
				ref.cropper = new Cropper(img, ref.cropper_options);
				ref.STATE = ref.STATE_CROPPER
				$(ref.buttons[3]).addClass('active')
			}
		}
	});
}

WebImageEditor.prototype.loadImage0 = function () {
	var ref = this;
	var input = document.createElement('input');
	input.type = 'file';
	input.setAttribute('accept', "image/*")
	input.click();
	input.addEventListener('change', function (e) {
		if (e.target.files[0].name) {
			let file = e.target.files[0]
			var reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			ref.img_name = e.target.files[0].name;
			reader.onload = function (f) {
				ref.img_data = f.target.result
			}
			ref.startCaman(URL.createObjectURL(file))
		}
	});
}

WebImageEditor.prototype.adjustCanvas = function (w, h) {
	let bw = this.body.offsetWidth
	let bh = this.body.offsetHeight
	
	let img_r = h / w
	let body_r = bh / bw
	
	if(body_r > img_r){ 
		this.canvas.style.height = "auto"
		this.canvas.style.width = "100%"
	} 
	else {
		this.canvas.style.height = "100%"
		this.canvas.style.width = "auto"
	}
}

WebImageEditor.prototype.startCaman = function (url) {
	var ref = this
	$(this.canvas).show()
	this.canvas.removeAttribute('data-caman-id');
	this.caman = Caman(this.canvas, url, function () {
		URL.revokeObjectURL(url);
		ref.adjustCanvas(this.width, this.height)
	});
}

WebImageEditor.prototype.startCropper = function () {
	this.cropper = new Cropper(this.canvas, this.cropper_options);
}


WebImageEditor.prototype.replaceImage = function(src){
	this.startCaman(src)
	this.img_data = src
}

WebImageEditor.prototype.getImageData = function(){
	// var canvas = this.cropper.getCroppedCanvas({
	// height : 512,
	// width : 512
	// });
	return this.canvas.toDataURL();
}

WebImageEditor.prototype.destroy = function () {
	if (this.element != null) this.element.remove();
	
	this.caman = null;
	this.canvas = null;
	this.element = null;
	this.img_name = '';
	this.src = '/res/blank-profile.png';
	this.buttons = [];
	this.close_btn = null;
}