async function getRelationType(uid, fid){
    let x = await database.ref('friendships/' + uid + '/' + fid).get()
    let y = await database.ref('friend_req/recieved/' + uid + '/' + fid).get()
    let z = await database.ref('friend_req/sent/' + uid + '/' + fid).get()
	return {
		is_friend : x.exists(),
		recieved : y.exists(),
		sent : z.exists()
	}
}

async function sendFriendRequest(uid, fid) {
    await database.ref('friend_req/sent/' + uid).update({ [fid]: firebase.database.ServerValue.TIMESTAMP } );
    await database.ref('friend_req/recieved/' + fid).update({ [uid]: firebase.database.ServerValue.TIMESTAMP } );
	return true
}

async function acceptFriendRequest(uid, fid){
	
	await database.ref('friendships/' + uid).update({ [fid]: firebase.database.ServerValue.TIMESTAMP } );
	await database.ref('friendships/' + fid).update({ [uid]: firebase.database.ServerValue.TIMESTAMP } );
	
	await database.ref('friend_req/sent/' + fid).child(uid).remove();
	await database.ref('friend_req/recieved/' + uid).child(fid).remove();
	return true
}

async function unfriendUser(uid, fid){
	await database.ref('friendships/' + fid + '/' + uid).remove()
	await database.ref('friendships/' + uid + '/' + fid).remove()
	return true
}

async function rejectFriendRequest(uid, fid) {
	await database.ref('friend_req/sent/' + fid).child(uid).remove();
	await database.ref('friend_req/recieved/' + uid).child(fid).remove();
	return true
}

async function cancelFriendRequest(uid, fid) {
	await database.ref('friend_req/sent/' + uid).child(fid).remove();
	await database.ref('friend_req/recieved/' + fid).child(uid).remove();
	return true
}
