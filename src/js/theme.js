function theme(app){
	this.current = null
}

theme.themes = {
	"def-lht" : { ext : 'lst', name : 'Default', src : '/res/themes/default.lst' },
	"cat-drk" : { ext : 'lst', name : 'Cat Dark', src : '/res/themes/cat_dark.lst' },
	"oxy-drk" : { ext : 'lst', name : 'Oxygen Dark', src : '/res/themes/oxygen_dark.lst' },
	"dmn-drk" : { ext : 'lst', name : 'Demon Dark', src : '/res/themes/demon_dark.lst' },
	"alc-drk" : { ext : 'lst', name : 'Alcohol Dark', src : '/res/themes/alcohol_dark.lst' },
	"lim-drk" : { ext : 'lst', name : 'Lime Dark', src : '/res/themes/lime_dark.lst' }
}

theme.prototype.loadAsLST = function(src){
	var ref = this;
	fetch(src).then(function(e){
		e.text().then(function(f){
			var data = lst.dissemble(f);
			ref.set(data)
		})
	})
}

theme.prototype.set = function(arr){
	
	for(i = 0; i < arr.length; i++){
		var key = arr[i].key;
		var value = arr[i].value;
		document.querySelector(':root').style.setProperty(key, value);
		default_theme[key] = value
	}
	
	
}

let default_theme = {}

fetch(theme.themes[localStorage.getItem("app-theme") || "def-lht"].src).then(function(e){
    e.text().then(function(f){
        let arr = lst.dissemble(f);
		for (a of arr) {
			default_theme[a.key] = a.value
		}
    })
})