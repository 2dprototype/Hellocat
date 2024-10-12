function VoiceUI(callback = function(){}){
	const ref = this;
	this.audio_context = null
	this.time_interval = null
	this.recorder = null
	this.audio_data = null
    this.element = $(`
		<div class="voice-ui-bg">
			<div class="voice-ui">
				<div class="header">
					<span class="title">Voice Racorder</span></span>
					<div class="close-btn">
					<img onload="SVGInject(this)" class="close" src="/res/icon/x.svg" height="30" width="30"/>
					</div>
				</div>
				<div class="body">
					<span class="time"></span>
				</div>
				<div class="footer">
					<button class="btn">Start</button>
					<button class="btn" disabled="true">Stop</button>
					<button class="btn" disabled="true">Send</button>
				</div>
			</div>
		</div>
	`)
	$('body').append(this.element)
	this.buttons = $(this.element).find('button')
	this.timeElement = $(this.element).find('.time')[0]
	this.closeElement = $(this.element).find('.close-btn')[0]
	this.init()
	
	$(ref.closeElement).click(function(){
		$(ref.element).remove()
	})
	
	$(ref.buttons[0]).click(function(){
		ref.recorder.record()
		var seconds = 0
		ref.time_interval = setInterval(function(){
			++seconds;
			var hour = Math.floor(seconds / 3600);
			var minute = Math.floor((seconds - hour * 3600) / 60);
			var updSecond = seconds - (hour * 3600 + minute * 60);
			ref.timeElement.innerText = hour + ":" + minute + ":" + updSecond;
		}, 1000);
		$(this).prop('disabled', true);
		$(ref.buttons[2]).prop('disabled', true);
		$(ref.buttons[1]).prop('disabled', false);
	})
	$(ref.buttons[1]).click(function(){
		ref.recorder && ref.recorder.stop();
		if(ref.time_interval) clearInterval(ref.time_interval)
		ref.recorder && ref.recorder.exportWAV(function(blob) {
			ref.audio_data = blob
		})
		ref.recorder.clear();
		$(this).prop('disabled', true);
		$(ref.buttons[0]).prop('disabled', false);
		$(ref.buttons[2]).prop('disabled', false);
	})
	$(ref.buttons[2]).click(function(){
		if(ref.audio_data){
			 callback(ref.audio_data)
			$(ref.element).remove()
			ref.recorder.clear()
			this.audio_context = null
			this.time_interval = null
			this.recorder = null
			this.audio_data = null
		}
	})
}


VoiceUI.prototype.init = function(){
	const ref = this
	try {
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		window.URL = window.URL || window.webkitURL;

		ref.audio_context = new AudioContext;
	} 
	catch (e) {
		alert('No web audio support in this browser!');
	}

	navigator.getUserMedia({audio: true}, function(stream){
		//console.log(stream, ref)
		var input = ref.audio_context.createMediaStreamSource(stream);
		//console.log('Media stream created.');
		ref.recorder = new Recorder(input);
		//console.log('Recorder initialised.');
	}, function(e) {
		alert('No live audio input: ' + e);
	})
}
