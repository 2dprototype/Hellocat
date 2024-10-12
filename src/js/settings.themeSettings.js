function themeSettings(settings){
	this.element = $(settings).find("#theme-settings");
	this.buttons = $(this.element).find('button');
	this.selects = $(this.element).find('select');
	this.theme_editor = $("#theme-editor")[0]
	this.th = {
		buttons : $(this.theme_editor).find('.bbtn'),
		body : $(this.theme_editor).find('.body')[0],
		// subbody : $(this.theme_editor).find('.subbody')[0]
	}
}

themeSettings.prototype.hide = function(dealy){
	$(this.element).hide(dealy);
}

themeSettings.prototype.show = function(dealy){
	$(this.element).show(dealy);
}

themeSettings.prototype._update = function(){ 
	var ref = this
	if (default_theme != null) {
		ref.th.body.innerHTML = ""
		for (const key in default_theme) {
			let value = default_theme[key]
			if (value.trim(" ")[0] == '#') {
				let div = document.createElement("div")
				div.setAttribute("class", "elm")
				{
					let inp = document.createElement("span")
					inp.innerText = key
					div.append(inp)
				}
				// {
					// let inp = document.createElement("input")
					// inp.type = 'text'
					// inp.value = value
					// inp.onchange = function(){
						// default_theme[key] = this.value
					// }
					// div.append(inp)
				// }
				{
					let inp = document.createElement("input")
					inp.type = 'color'
					inp.value = value
					inp.onchange = function(){
						default_theme[key] = this.value
					}
					div.append(inp)
				}
				ref.th.body.append(div)
			}
		}
	}
}
themeSettings.prototype.init = function(__ref){
	var ref = this;
	
	for(var key in theme.themes){
		var th = theme.themes[key];
		var elm = ref.selects[0];
		var option = document.createElement('option');
		option.setAttribute('value', key);
		option.innerText = th.name;
		elm.appendChild(option);
	}
	
	$(ref.selects[0]).change(function(){
		__ref.setThemeToDatabase(this.value);
	});
	
	$(ref.buttons[0]).click(function(){
		$(ref.theme_editor).show()
		ref._update()
	});
	$(ref.buttons[1]).click(function(){
		localStorage.removeItem("app-theme")
		__ref.setThemeToDatabase("def-lht");
	});
	$(ref.th.buttons[0]).click(function(){
		$(ref.theme_editor).hide()
	});
	$(ref.th.buttons[1]).click(function(){
		var input = document.createElement('input');
		input.type = 'file';
		input.click();
		input.addEventListener('change', (e) => {
			if(e.target.files[0].name){
				var reader =  new FileReader();
				reader.readAsText(e.target.files[0]);
				reader.onload =  function(e){
					let arr = lst.dissemble(e.target.result);
					for (a of arr) {
						default_theme[a.key] = a.value
					}
					ref._update()
				}
			}
		})
	});
	
	$(ref.th.buttons[2]).click(function(){
		let arr = []
		for (key in default_theme) {
			arr.push({
				key : key, 
				value : default_theme[key]
			})
		}
		let blob = new Blob([lst.assemble(arr)], {
			type: "text/plain;charset=utf-8"
		});
		saveAs(blob, "theme.lst")
	});
	
	$(ref.th.buttons[3]).click(function(){
		for (key in default_theme) {
			let value = default_theme[key]
			document.querySelector(':root').style.setProperty(key, value)
			$(ref.theme_editor).hide()
		}
	});
}
