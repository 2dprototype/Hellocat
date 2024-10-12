const hljs_listLanguages = [
	"bash","c","cpp","cs","css","diff","go","graphql",
	"ini","java","js","json","kt","less","lua","makefile",
	"xml","md","objectivec","perl","php","php-template",
	"txt","py","python-repl","r","ruby","rs","scss",
	"shell","sql","swift","ts","vbnet","wasm","yml", 
	"yaml", "html"
]

function fileViewer() {
	this.element = null;
	this.close_btn = null
	this.body = null;
	this.buttons = [];
	this.title = 'File Viewer'
}

fileViewer.prototype.hide = function () {
	$(this.element).hide(200);
}

fileViewer.prototype.show = function () {
	$(this.element).show(200);
}


fileViewer.prototype.createInterface = function () {
	var ref = this;
	
	this.element = document.createElement('div');
	this.element.setAttribute('class', 'file-viewer-bg');
	this.element.innerHTML = `
	<div class="file-viewer">
	<div class="header">
	<span class="title"></span></span>
	<div class="close-btn">
	<img onload="SVGInject(this)" class="close" src="/res/icon/x.svg" height="30" width="30"/>
	</div>
	</div>
	<div class="body"></div>
	<div class="footer"></div>
	`
	document.querySelector('body').appendChild(this.element);
	
	this.buttons = $(this.element).find('button');
	this.close_btn = $(this.element).find('.close-btn')[0];
	this.body = $(this.element).find('.body')[0];
	
	
	$(ref.close_btn).click(function () {
		ref.destroy();
	});
	
	// $(ref.buttons[0]).click(function () {
	
	// });
	// $(ref.buttons[1]).click(function () {
	
	// });
	
}


fileViewer.prototype.loadFile = function (url, type, ext){
	var ref = this;
	this.title +=  ' [' + ext + ']'
	var titleELm = $(this.element).find(".title")[0]
	titleELm.innerText = ref.title
	
	if(is_image_type(type)){
		var img = new Image()
		img.src = url;
		img.style.top = '50%';
		img.style.right = '50%';
		img.style.position = 'absolute';
		img.style.transform = 'translate(50%, -50%)';
		if(window.innerHeight > window.innerWidth) {
			//mobile..
			img.style.height = 'auto'
			img.style.width = '100%'
		}
		else {
			//  desktop or else...
			img.style.height = '100%'
			img.style.width = 'auto'
		}
		ref.body.appendChild(img)
	}
	else if(is_audio_type(type)){
		// fetch_as_blob(url, function(blob){
		// let audio = new Audio();
		// audio.src = URL.createObjectURL(blob);
		// const wavesurfer = WaveSurfer.create({
		// container: ref.body,
		// waveColor: 'rgb(200, 0, 200)',
		// progressColor: 'rgb(100, 0, 100)'
		// })
		// wavesurfer.load(audio);
		// })
		var sound = document.createElement('audio');
		sound.setAttribute('class', 'audio-content')
		sound.controls = 'controls';
		sound.src = url;
		sound.type = type;
		ref.body.appendChild(sound);
	}
	else if(is_video_type(type)){
		var video_elm = document.createElement("video");
		video_elm.setAttribute("src", url);
		video_elm.setAttribute("class", "video-content");
		video_elm.setAttribute("controls", "controls");
		video_elm.src = url;
		video_elm.style.top = '50%';
		video_elm.style.right = '50%';
		video_elm.style.position = 'absolute';
		video_elm.style.transform = 'translate(50%, -50%)';
		if(window.innerHeight > window.innerWidth) {
			//mobile..
			video_elm.style.height = 'auto'
			video_elm.style.width = '100%'
		}
		else {
			//  desktop or else...
			video_elm.style.height = '100%'
			video_elm.style.width = 'auto'
		}
		ref.body.appendChild(video_elm);
	}
	else if(hljs_listLanguages.includes(ext)) {
		fetch_as_text(url, function(text){
			let h = hljs.highlight(text, {language: ext})
			// $(ref.body).html(replace_tabs(replace_newline(h.value)))
			$(ref.body).html(`<pre style="tab-size:4"><code>${h.value}</code></pre>`)
		})
	}
	else if(ext == "td" || ext == "tdx" || ext == "uwu") {
		fetch_as_text(url, function(text){
			let h = hljs.highlight(text, {language: "rust"})
			// $(ref.body).html(replace_tabs(replace_newline(h.value)))
			$(ref.body).html(`<pre style="tab-size:4"><code>${h.value}</code></pre>`)
		})
	}
	else if(ext == 'obj'){  
		let height = ref.body.offsetHeight
		let width = ref.body.offsetWidth
		// Create a scene
		var scene = new THREE.Scene();
		// Create a camera
		var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		camera.position.z = 5;
		// Create a renderer with lower quality settings
		var renderer = new THREE.WebGLRenderer({ antialias: false, precision: 'lowp' });
		renderer.setSize(width, height);
		ref.body.appendChild(renderer.domElement);
		// Load the OBJ model
		var loader = new THREE.OBJLoader();
		loader.load(
			url,
			function (object) {
				scene.add(object);
			},
			function (xhr) {
				titleELm.innerText = ref.title + " [" + (((xhr.loaded / xhr.total) * 100).toFixed(2) + '%]')
			},
			function (error) {
				titleELm.innerText = ref.title + ' [Error]'
			}
		);
		
		// Add a directional light
		var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(1, 1, 1).normalize();
		scene.add(directionalLight);
		
		// var directionalLight = new THREE.DirectionalLight(0xff0000, 1);
		// directionalLight.position.set(10, 0, 0).normalize();
		// scene.add(directionalLight);
		
		// var directionalLight = new THREE.DirectionalLight(0x0000ff, 1);
		// directionalLight.position.set(0, 10, 0).normalize();
		// scene.add(directionalLight);
		
		// Create mouse controls
		var controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		controls.dampingFactor = 0.25;
		controls.screenSpacePanning = false;
		controls.maxPolarAngle = Math.PI / 2;
		
		// Create an animation loop
		function animate() {
			requestAnimationFrame(animate);
			controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
			renderer.render(scene, camera);
		}
		
		// Handle window resize
		window.addEventListener('resize', function () {
			var newWidth = width;
			var newHeight = height;
			
			camera.aspect = newWidth / newHeight;
			camera.updateProjectionMatrix();
			
			renderer.setSize(newWidth, newHeight);
		});
		
		// Start the animation loop
		animate();
	}
	else if(ext == 'apk'){
		fetch_as_blob(url, function(data){
			var file = new File([data], "hello.apk", {type:"application/vnd.android.package-archive"});
			var parser = new AppInfoParser(file) 
			parser.parse().then(function(result){
				let info_json = JSON.stringify(result, null, 4)
				//console.log(result)
				saveAs(new Blob([info_json], {type:'application/json'}), 'info.json')
				$(ref.body).html(`
					<img height="64" width="64" src="${result.icon}"/>
					<table>
					<tr>
					<th>package</th>
					<th>${result.package}</th>
					</tr>
					<tr>
					<th>versionName</th>
					<th>${result.versionName}</th>
					</tr>
					</table>
				`)
			})
			.catch(function(err){
				$(ref.body).html(`<code><span style="color:#f00;">${err}</span></code>`)
			})
		})
		
	}
	else {
		fetch_as_text(url, function(text){
			let pre = document.createElement('pre')
			let code = document.createElement('pre')
			code.innerText = text
			pre.appendChild(code)
			ref.body.appendChild(pre)
			// ref.body.appendChild(code)
		})
	}
}

fileViewer.prototype.destroy = function () {
	if (this.element != null) this.element.remove();
	this.element = null;
	this.close_btn = null
	this.body = null;
	this.buttons = [];
}

function view_file(url, type, ext){
	var fv = new fileViewer()
	fv.createInterface();
	// //console.log(url, type, ext)
	fv.loadFile(url, type, ext)
}			