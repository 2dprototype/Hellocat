function validate_username(unme){
	var reg =  /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/igm
	return reg.test(uname)
}

function is_human_name(uname){
	var reg =  /^[^(<>/\\{}`*)]*$/
	return reg.test(uname)
}

function validate_name(name){
	if(name.length > 0 && name.length < 19){
		if (is_human_name(name)) return true
	}
	return false
}