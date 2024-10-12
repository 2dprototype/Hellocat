/***
	lst 1.0.1 
	developer : Mahdin Hasan / 2D Prototype
***/


function lst(){
	this.keywords = [ 'true', 'false', 'null' ];
}

lst.prototype.obj_get_val = function(obj, __key){
	var res;
	Object.entries(obj).forEach(entry => {
		let value = entry.pop()
		let key = entry.pop()
		if(key == __key) res = value
	})
	return res
}

lst.prototype.split_lines = function(text){
	
	var lines = [];
	var vars = [];
	var arr = text.split("\n");
	
	for(i = 0; i < arr.length; i++){
		var t = arr[i].trim();
		if(t[0] == "$"){
			var text = t.slice(t.indexOf('$') + 1, t.length).trim();
			vars.push(text);
		}
		else if(t.length <= 0){
			//console.log(t)
		}
		else if(t[0] != "#"){
			lines.push(arr[i]);
		}
	}
	
	return [lines, vars]
	cons
}

lst.prototype.split_vars = function(vars){
	
	var _vars = {};
	
	for(i = 0; i < vars.length; i++){
		var arr = vars[i].split(";");
		for(a = 0; a < arr.length; a++){
			var str = arr[a];
			var key = str.slice(0, str.indexOf('::')).trim();
			var val = str.slice(str.lastIndexOf('::') + 2, str.length).trim();
			if(key in _vars) console.error(`Error : "${key}" has already been declared.`);
			else if(key.length > 0) _vars[key] = val;
		}
	}

	return _vars
}

lst.prototype.split_comma = function(text){
	
	var arr = text.split(",");
	
	return arr
	
}

lst.prototype.toObject = function(arr, ___vars){
	var obj = {
		keys : [],
		values : []
	}
	
	
	var vars = this.split_vars(___vars);

	for(j = 0; j < arr[0].length; j++){
		obj.keys.push(arr[0][j].trim().split(" ").join(""));
	}
	
	for(i = 1; i < arr.length; i++){
		var data = [];
		for(j = 0; j < arr[i].length; j++){
			var __dta = arr[i][j].trim();
			data.push(this.parse_datatype(this.set_vars(__dta, vars)));
		}
		if(obj.keys.length == data.length) obj.values.push(data);
		else if(obj.keys.length < data.length) obj.values.push(data.slice(0, obj.keys.length));
		else if(data.length > 0) obj.values.push(data)
	}	
	
	return obj
}

lst.prototype.set_vars = function(text, obj){
	// if(text in obj) return eval(`obj.${text}`);
	if(text in obj) return this.obj_get_val(obj, text);
	else return text
}


lst.prototype.parse_string = function(text){
	var str = text.slice(text.indexOf('"') + 1, text.lastIndexOf('"'))
	return str.replace(/\\c/g, ',').replace(/\\n/g, '\n').replace(/\\g/g, ';');
}

lst.prototype.set_string = function(str){
	var text = str.replace(',', String.fromCharCode(92,99)).replace('\n', String.fromCharCode(92,110)).replace(';', String.fromCharCode(92,103));
	return '"' + text + '"';
}

lst.prototype.setDataType = function(dta){
	if(typeof dta == 'string') return this.set_string(dta);
	else if(typeof dta == 'boolean') return `${dta}`;
	else if(dta === null) return `null`;
	else if(typeof dta == 'number') return `${dta}`;
	else return 'null'
}

lst.prototype.parse_datatype = function(text){
	if(text.length == 0) return '';
	else if(text[0] == '"' && text[text.length - 1] == '"') return this.parse_string(text);
	else if(text == this.keywords[0]) return true;
	else if(text == this.keywords[1]) return false;
	else if(text == this.keywords[2]) return null;
	else if(!isNaN(parseFloat(text))) return parseFloat(text);
	else return null
}

lst.prototype.parse = function(text){
	
	if(text == undefined || text == null || text.length == 0) return {};
	
	var spl = this.split_lines(text)
	var lines = spl[0];
	var vars = spl[1];
	
	var arr = [];
	
	for(i = 0; i < lines.length; i++){
		arr.push(this.split_comma(lines[i]));
	}
	
	var obj = this.toObject(arr, vars);

	return obj;
	
}

lst.prototype.reassemble = function(data, space = 1){
	return this.assemble( this.dissemble(data), space);
}

lst.prototype.assemble = function(obj, space = 1){
	var object = {
		keys : [],
		values : []
	}
	
	var arr = [];
	for(i = 0; i < obj.length; i++){
		var keys = Object.keys(obj[i]);
		arr.push(...keys);
	}
	
	object.keys = [...new Set(arr)];
	
	for(i = 0; i < obj.length; i++){
		var values = Object.values(obj[i]);
		var keys = Object.keys(obj[i]);
		var x = [];
		for(k = 0; k < object.keys.length; k++){
			var key = object.keys[k];
			var val = values[k];
			var m = object.keys.indexOf(keys[k]);
			if(m > -1) x[m] = val;
			else x[m] = null;
		}	
		object.values.push(x);
	}
	
	return  this.stringify(object, space)
	
}

lst.prototype.dissemble = function(text){
	var data = this.parse(text);
	var arr = [];

	for(j = 0; j < data.values.length; j++){
		var _obj = {};
		for (i = 0; i < data.keys.length; i++){
		var a = data.keys[i];
			if(data.values[j][i] != undefined) _obj[a] = data.values[j][i];
		}
		arr.push(_obj);
	}
	return arr
}

lst.prototype.get_space = function(space = 1){
	var str = '';
	for(a = 0; a < space; a++) str += ' ';
	return str
}

lst.prototype.getMax = function(obj){
	var values = [];
	values.push(obj.keys)
	values.push(...obj.values)

	var keys = obj.keys;
	var max = [];
	
	for(k = 0; k < keys.length; k++){
		max.push('');
		for(i = 0; i < values.length; i++){
			var val =  this.setDataType(values[i][k]);
			if(val.length > max[k].length) max[k] = val;
		}
	}

	return max
}


lst.prototype.stringify = function(obj, space = 1){
	
	var _str = '';
	var arr = [''];
	var max = this.getMax(obj);
	for(i = 0; i < obj.keys.length; i++){
		var mx = max[i];
		var __space = 0;
		__space = mx.length - obj.keys[i].length;
		if(i < obj.keys.length - 1) arr[0] += obj.keys[i] + ',' + this.get_space(__space + space);
		else arr[0] += obj.keys[i];
	}
	for(i = 0; i < obj.values.length; i++){
		var str = '';
		for(j = 0; j < obj.values[i].length; j++){
			var __val = this.setDataType(obj.values[i][j]);
			var mx = max[j];
			var __space = 0;
			__space = mx.length - __val.length;
			// console.log(`${mx.length} - ${__val.length} = ${__space}`)
			if(j < obj.values[i].length - 1) str += __val + ',' + this.get_space(__space + space);
			else str += __val;
		}
		arr.push(str);
	}
	for(i = 0; i < arr.length; i++){
		_str += arr[i] + '\n';
	}
	
	return _str
}

var lst = new lst();
