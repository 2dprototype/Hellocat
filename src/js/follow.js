async function follow(fid, uid) {
	try {
		await firebase.database().ref('following/' + uid).update({ [fid]: firebase.database.ServerValue.TIMESTAMP } );
		await firebase.database().ref('followers/' + fid).update({ [uid]: firebase.database.ServerValue.TIMESTAMP } );
		return true
	}
	catch (err) {
		return false
	}
}

async function unfollow(fid, uid) {
	try {
		await firebase.database().ref('followers/' + fid + '/' + uid).remove()
		await firebase.database().ref('following/' + uid + '/' + fid).remove()
		return true
	}
	catch (err) {
		return false
	}
}
