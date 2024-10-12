const HISTORY_TYPE = {
	SIGNIN : 'USER-SIGNIN',
	SIGNUP : 'USER-SIGNUP'
}

function setLoginHistory(type){
    database.ref('history/' + auth.getUid() + '/login').push({
		timestamp : firebase.database.ServerValue.TIMESTAMP,
		ua : window.navigator.userAgent,
		type : type,
		hc_version : app.version,
		resolution : window.innerWidth + '*' + window.innerHeight
	}).then(function(e){
		setOtherHistoryStuff(e.getKey())
	})
}


function setOtherHistoryStuff(key){
	$.getJSON('https://json.geoiplookup.io/?callback=?', function(data) {
		database.ref('history/' + auth.getUid() + '/login/' + key).update({
			location : {
				continent : data.continent_name,
				country : data.country_name,
				country_code : data.country_code,
				district : data.district,
				city : data.city,
			},
			hostname : data.hostname
		})
	});
    $.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
		database.ref('history/' + auth.getUid() + '/login/' + key).update({
			ip : data.ip
		})
	});
}