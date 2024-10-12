function historySettings(settings){
	this.element = $(settings).find("#history-settings");
	this.login_his = $(this.element).find('#login-history')[0]
	this.login_chart_c = $(this.element).find('#login-history-chart')[0]
	this.login_chart = null;
}

historySettings.prototype.hide = function(dealy){
	$(this.element).hide(dealy);
}

historySettings.prototype.show = function(dealy){
	$(this.element).show(dealy);
}


historySettings.prototype.clear = function(){
	var ref = this;
	ref.login_his.innerHTML = ''
}
historySettings.prototype.loadLoginHistory = function(){
	var ref = this;
	ref.clear()
	database.ref('history/' + auth.getUid() + '/login').orderByChild('timestamp').get().then(function(logins) {
		var data0 = [];
		var labels = [];
		var count = 0;
		logins.forEach(function(e){
			const val = e.val()
			const loc = val.location || val.__cpLocation || {};
			const battery = val.battery || {};
			const ua = new UAParser(val.ua).getResult();
			const os = ua.os;
			const browser = ua.browser;
			const device = ua.device;
			
			data0.push(new Date(val.timestamp).getHours())
			labels.push(count)
			
			var type = '-'
			var os_src = '/res/icon/os/question-lg.svg'
			if(val.type == HISTORY_TYPE.SIGNIN) type = 'Login'
			else if(val.type == HISTORY_TYPE.SIGNUP) type = 'Account created'
			
			let title = type + ' on ' + (os.name || '?') + ' near ' + (loc.district || '?') + ', ' + (loc.country || '?')
			let _device = (device.model || '?') + ' | ' + (device.vendor || '?') + ' | ' + (device.type || '?')
			let _browser = (browser.name || '?') + ' | ' + (browser.version || '?') + ' | ' + (browser.major || '?')
			let _loc = (loc.district || '?') + ' | ' + (loc.country || '?') + ' | ' + (loc.continent || '?')
			let _ip = val.ip || '?'
			
			if(os.name == "Android") os_src = '/res/icon/os/android.svg'
			else if(os.name == "Windows") os_src = '/res/icon/os/windows.svg'
			else if(os.name == "iOS") os_src = '/res/icon/os/apple.svg'
			else if(os.name == "Ubuntu") os_src = '/res/icon/os/ubuntu.svg'
			
			
			// //console.log(val)
			$(ref.login_his).prepend(`
				<div class="login-box box">
				<div class="title"><img src="${os_src}" onload="SVGInject(this)" height="16" width="16" /><span>${title}</span></div>
				<div class="text location">${_loc}</div>
				<div class="text time">${formatTimestamp(val.timestamp)}</div>
				<div class="text ip link">IP Address : ${_ip}</div>
				<div class="text device link">Device : ${_device}</div>
				<div class="text browser link">Browser : ${_browser}</div>
				</div>
			`)
			count++
		})
		ref.login_chart.data.datasets[0].data = data0;
		ref.login_chart.data.labels = labels;
		ref.login_chart.update()
	})
}

historySettings.prototype.init = function(__ref){
	var ref = this;
	
	var config = {
		type: 'line',
		data: {
			labels: [],
			datasets: [
				{
					data: [],
					lineTension: 0,
					backgroundColor: 'transparent',
					borderColor: '#5d8ffc',
					borderWidth: 2,
					pointBackgroundColor: '#5d8ffc',
					label: 'Hours'
				}
			]
		},
		options: {
			animations: {
				radius: {
					duration: 400,
					easing: 'linear',
					loop: (context) => context.active
				}
			},
			scales: {
				x: {
					type: 'time',
					time: {
						tooltipFormat: 'DD T'
					},
					title: {
						display: true,
						text: 'Date'
					}
				},
				y: {
					title: {
						display: true,
						text: 'value'
					}
				}
			},
			legend: {
				display: true
			}
		}
	}
	
	ref.login_chart = new Chart(ref.login_chart_c, config);
	
}