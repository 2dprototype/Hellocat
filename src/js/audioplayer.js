class AudioPlayer {
	constructor(src, callback) {
		var ref = this
		this.id = randomString(16)
		this.audio = new Audio()
		this.audio.preload = "auto"
		this.audio.src = src	
		
		this.audio.onplaying = function(){
		    ref.step(ref)
		}
		this.audio.onended = function(){
		    ref.pause()
		}
		
		this.body = document.createElement("div")
		this.body.setAttribute('class', 'audio-player')
		{
			this.playButton = document.createElement("button")
			this.playButton.setAttribute('class', 'play')
			this.playButton.setAttribute('playing', 'false')
			this.playButton.style.margin = '0'
			this.playButton.addEventListener("click", function(e){
				callback(ref.id)
				e.stopPropagation()
				if (this.getAttribute("playing") == "false") {
					ref.play()
				}
				else {
					ref.pause()
				}
			})
			{
				this.playImg = document.createElement('div')
				this.playImg.appendChild(this.getImg('/res/icon/b/play-fill.svg'))
				this.playButton.appendChild(this.playImg)
			}
			{
				this.pauseImg = document.createElement('div')
				this.pauseImg.style.display = 'none'
				this.pauseImg.appendChild(this.getImg('/res/icon/b/pause-fill.svg'))
				this.playButton.appendChild(this.pauseImg)
			}
			this.body.appendChild(this.playButton)
		}
		{
			this.progress = document.createElement("div")
			this.progress.setAttribute('class', 'progress')
			this.progress.onclick = function (event) {
				event.stopPropagation()
				var rect = this.getBoundingClientRect()
				var percentage = (event.clientX - rect.left) / this.offsetWidth
				ref.audio.currentTime = percentage * ref.audio.duration
			}
			{
				this.progressBar = document.createElement("div")
				this.progressBar.setAttribute('class', 'bar')
				this.progress.appendChild(this.progressBar)
			}
			this.body.appendChild(this.progress)
		}
	}
	
	play() {
		this.audio.play()
		this.playImg.style.display = 'none'
		this.pauseImg.style.display = 'block'
		this.playButton.setAttribute("playing", "true")
	}
	
	pause() {
		this.audio.pause()
		this.playImg.style.display = 'block'
		this.pauseImg.style.display = 'none'
		this.playButton.setAttribute("playing", "false")
	}
	
	step(ref) {
		ref.progressBar.style.width = ((ref.audio.currentTime / ref.audio.duration) * 100 || 0) + "%";
		requestAnimationFrame(function(){
		    ref.step(ref)
		})
	}
	
	getImg(src) {
		let img = new Image()
		img.src = src
		img.width = 20
		img.height = 20
		img.onload = function(){
			SVGInject(this)
		}
		return img
	}
}