function profileSettings(settings){
	this.element = $(settings).find("#profile-settings");
	this.imgs = $(this.element).find('img');
	this.inputs = $(this.element).find('input');
	this.spans = $($(this.element).find('.mini-details')[0]).find('span');
	this.selects = $(this.element).find('select');
	this.textareas = $(this.element).find('textarea');
	this.buttons = $(this.element).find('button');
	this.WebImageEditor = new WebImageEditor();
	this.WebImageEditor.cropper_options = {
		aspectRatio: 16 / 16,
	}
}

profileSettings.prototype.hide = function(dealy){
	$(this.element).hide(dealy);
}

profileSettings.prototype.show = function(dealy){
	$(this.element).show(dealy);
}


profileSettings.prototype.clear = function(){
	var ref = this;
	ref.spans[0].innerText = '';
	ref.spans[1].innerText = '';
	ref.spans[2].innerText = '';
	ref.spans[3].innerText = '';
	ref.imgs[0].src = 'res/blank-profile.png';
	ref.inputs[0].value = '';
	ref.inputs[1].value = '';
	ref.inputs[2].value = '';
	ref.inputs[3].value = '';
	ref.inputs[4].value = '';
	ref.selects[0].value = '';
	ref.textareas[0].value = '';
	// ref.updateTextarea();
}
profileSettings.prototype.updateUserData = function(__ref){
	var ref = this;
	var firstName = ref.inputs[0].value.trim();
	var lastName = ref.inputs[1].value.trim();;
	// var username = ref.inputs[2].value;
	// var email = ref.inputs[3].value;
	var birth = new Date(ref.inputs[4].value).getTime();
	var gender = ref.selects[0].value;
	var bio = ref.textareas[0].value;
	
	
	let cond = validate_name(firstName) && (validate_name(lastName) || lastName == "")
	
	// //console.log(cond)
	
	if(cond){
		//firestore
		firestore.collection("users").doc(auth.getUid()).update({
			name : [firstName, lastName],
			birth : birth,
			gender : gender,
			bio : bio
		});
		//realtime database
		firebase.database().ref('users/' + auth.getUid()).update({
			name : [firstName, lastName],
			birth : birth,
			gender : gender,
			// username : username,
			bio : bio,
			lastUpdated : firebase.database.ServerValue.TIMESTAMP
			}).then(function(){
		    __ref.mainBody.head.spans[0].innerText = formatName(firstName, lastName)
		})
	}
	else {
		alert("Invalid Information!")
	}
}

profileSettings.prototype.getUserData = function(){
	
	var ref = this;
	
	database.ref('users/' + auth.getUid()).get().then(function(e){
		var val = e.val();
		let lastUpdated = val.lastUpdated || val.accountCreated;
		ref.spans[0].innerText = 'Joined ' + getTimeDiffAndPrettyText(new Date(val.accountCreated)).friendlyNiceText;
		ref.spans[1].innerText = 'Last Updated ' + getTimeDiffAndPrettyText(new Date(lastUpdated)).friendlyNiceText;
		ref.spans[2].innerText = '';
		ref.spans[3].innerText = '';
	});
	
	ref.inputs[3].value = auth.currentUser.email;
	
	firestore.collection('users').doc(auth.getUid()).get().then(function(doc){
		if(doc.exists){
			var data = doc.data();
			// //console.log(data)
			ref.imgs[0].src = data.profile_picture;
			ref.inputs[0].value = data.name[0];
			ref.inputs[1].value = data.name[1];
			ref.inputs[2].value = data.username;
			ref.inputs[4].value = timestampToDate(data.birth);
			ref.selects[0].value = data.gender;
			ref.textareas[0].value = data.bio;
			// ref.updateTextarea();
		} 
		else{
			ref.clear();
		}
		}).catch(function(error){
		//console.log("Error getting document:", error);
	});
	// database.ref('users/' + auth.getUid() + '/location').get().then(function(e){
		// let val = e.val()
		// ref.inputs[5].value = val.latitude + ', ' + val.longitude
	// })
}


// profileSettings.prototype.updateTextarea = function(){
// $(this.textareas[0]).highlightTextarea('setRanges', getArrayOfPatternRange(this.textareas[0].value));
// $(this.textareas[0]).highlightTextarea('setOptions', { resizable : true });
// this.textareas[0].style.width = `${this.element[0].offsetWidth - 20}px`;
// }

profileSettings.prototype.init = function(__ref){
	var ref = this;
	
	$(ref.inputs[5]).hide()
	$(ref.inputs[6]).hide()
	// $(ref.inputs[6]).click(function(e){
		// navigator.geolocation.getCurrentPosition(function(e){
			// database.ref('users/' + auth.getUid() + '/location').update({
				// latitude : e.coords.latitude,
				// longitude : e.coords.longitude,
				// accuracy : e.coords.accuracy,
				// timestamp : e.timestamp
			// })
			// ref.inputs[5].value = e.coords.latitude + ', ' + e.coords.longitude
		// });
	// });
	// $(ref.textareas[0]).keyup(function(e){
	// ref.updateTextarea();
	// });
	// $(ref.textareas[0]).keydown(function(e){
	// ref.updateTextarea();
	// });
	//update info
	$(ref.buttons[0]).click(function(e){
		ref.updateUserData(__ref);
		ref.hide();
		$(__ref.settings.options_elm).show();
	});
	//cancel
	$(ref.buttons[1]).click(function(e){
		ref.hide();
		$(__ref.settings.options_elm).show();
	});
	
	//change profile pic
	$(ref.imgs[0]).click(function(e){
		ref.WebImageEditor.createInterface(function(e){
			var uid = auth.currentUser.uid;
			var img_data = e.getImageData();
			var storageRef = storage.ref('users/' + uid + '/profile.png');
			var progress_bar = new ProgressBar();
			var uploadTask = storageRef.putString(img_data, 'data_url');
			progress_bar.createInterface();
			uploadTask.then(function(snapshot){
				snapshot.ref.getDownloadURL().then(function(img_url){
					// set image link to firesotre
					firestore.collection("users").doc(uid).update({
						profile_picture : img_url
					});
					//set image link to realtime database
					firebase.database().ref('users/' + uid).update({
						profile_picture : img_url
					});	
					__ref.mainBody.head.imgs[0].src = img_url;
					ref.imgs[0].src = img_url;
					progress_bar.destroy();
				});
			});
			uploadTask.on('state_changed', function(data){
				var percent = (data.bytesTransferred/data.totalBytes) * 100 
				progress_bar.setPercent(percent);
			})
			e.destroy();
		}, 1);
		// firestore.collection('users').doc(auth.getUid()).get().then(function(doc){
		// if(doc.exists){
		// // var url = doc.data().profile_picture;
		// // ref.WebImageEditor.replaceImage(url);
		// }
		// else{
		// // ref.WebImageEditor.replaceImage('res/blank-profile.png');
		// // ref.WebImageEditor.loadImage0();
		// }
		// })
		// .catch(function(error){
		// //console.log("Error getting document:", error);
		// });
		// ref.WebImageEditor.loadImage();
	})
}