function updateVisited() {
	database.ref("total_visited").get().then(function(e){
		if(e.exists()) database.ref("total_visited").set(e.val()+1)
		else database.ref("total_visited").set(1)
	})
}

function removeConversationFromList(uid, fid) {
	database.ref('chats/' + uid + '/' + fid).remove()
}

function createConversation(uid, fid, callback) {
	var chat_id = CryptoJS.MD5(uid + fid).toString()
	var chat_obj = {
		user_0 : uid,
		user_1 : fid,
		conversation_started : firebase.database.ServerValue.TIMESTAMP,
	}
	
	database.ref('chats/' + uid + '/' + fid).get().then(function(e){
		if(!e.exists()){
			firebase.database().ref('chats/' + uid).update({ [fid]: chat_id } );
			firebase.database().ref('chats/' + fid).update({ [uid]: chat_id } );
			firebase.database().ref('chats_data/' + chat_id).update(chat_obj);
			firebase.database().ref('chats_data/' + chat_id + '/messages').push({
				type : 'event',
				eventType : 'chat-started',
				send_from : uid,
				send_to : fid,
				timestamp : firebase.database.ServerValue.TIMESTAMP,
				isSeenByReceiver : false
				}).then(function(e){
				if(typeof callback == 'function') callback(e)
			})
		}
		else{
			alert('Conversation with this person is already available.');
		}
	});
}

function sendCodeMsg(uid, fid, cid, msg_data, lang, reply = null){
	database.ref('chats_data/' + cid + '/messages').push({
		type : 'code',
		lang : lang,
		data : msg_data,
		send_from : uid,
		send_to : fid,
		timestamp : firebase.database.ServerValue.TIMESTAMP,
		isSeenByReceiver : false,
		reply_of : reply
	})
}

function sendTextMsg(uid, fid, cid, msg_data, reply = null, style = null){
	database.ref('chats_data/' + cid + '/messages').push({
		type : 'text',
		data : msg_data,
		send_from : uid,
		send_to : fid,
		timestamp : firebase.database.ServerValue.TIMESTAMP,
		isSeenByReceiver : false,
		reply_of : reply,
		style: style
	})
}

function sendEmojiMsg(uid, fid, cid, emoji_name, emoji_size = 40, reply = null, style = null){
	database.ref('chats_data/' + cid + '/messages').push({
		type : 'emoji',
		emoji : emoji_name,
		size : emoji_size,
		send_from : uid,
		send_to : fid,
		timestamp : firebase.database.ServerValue.TIMESTAMP,
		isSeenByReceiver : false,
		reply_of : reply,
		style: style
	})
}


function sendFileMsg(uid, fid, cid, msg_url, filetype, filename, ext, reply = null){
	database.ref('chats_data/' + cid + '/messages').push({
		type : 'file',
		filetype : filetype,
		filename : filename,
		url : msg_url,
		ext : ext,
		send_from : uid,
		send_to : fid,
		timestamp : firebase.database.ServerValue.TIMESTAMP,
		isSeenByReceiver : false,
		reply_of : reply
	})
}

function removeMsg(cid, mid, bin){
	database.ref('chats_data/' + cid + '/messages/' + mid).update({
		removed : true,
		data: null,
		url: null
	})
}


function get_last_msg(cid, callback = function(){}){
    database.ref('chats_data/' + cid + '/messages').orderByChild('timestamp').limitToLast(1).get().then(function(e){
		if(e.exists()){
			var val = e.val();
			if(typeof val == 'object') callback(Object.values(val)[0])
		}
	})
}

function seeMsg(cid, mkey){
    database.ref('chats_data/' + cid + '/messages/' + mkey).update({ 
		isSeenByReceiver : true,
		seenByReceiverAt : firebase.database.ServerValue.TIMESTAMP
	})
}


function reactMsg(uid, cid, mid, type = 'heart'){
	var obj = { 
		[uid]: {
			timestamp : firebase.database.ServerValue.TIMESTAMP,
			type : type
		} 
	}
    database.ref('chats_data/' + cid + '/messages/' + mid + '/reacts').update(obj)
}

function unreactMsg(uid, cid, mid){
    database.ref('chats_data/' + cid + '/messages/' + mid + '/reacts/' + uid).remove()
}


async function add() {
    let chats = await database.ref('chats/' + auth.getUid()).get()
    let c_arr = {}
    let e_arr = []
    chats.forEach(function(chat){
        c_arr[chat.key] = chat.val()
	})
    for (let key in c_arr) {
        let val = c_arr[key]
        let user = await database.ref('users/' + key).get()
        let chat_data = await database
		.ref('chats_data/' + val + '/messages')
		.orderByChild('timestamp')
		.limitToLast(1)
		.get()
        let user_val = user.val()
        let chat_data_val =  Object.values(chat_data.val())[0]
        e_arr.push({
            title : user_val.name,
            img : user_val.profile_picture,
            timestamp : chat_data_val.timestamp,
            isSeen : chat_data_val.isSeenByReceiver,
		})
	}
    e_arr.sort(function(a, b){
        return b.timestamp - a.timestamp
	})
}
