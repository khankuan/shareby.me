var user = {
  transferIds: {},
  downloadedFileCount: 0
};



function userStartListening(){
  //  Start audiosign broadcaster
  user.listener = new AudioSign.AudioSignListener({
    size: 56,
    step: 22
  });
  user.listener.on('candidate', function(roomId){
    //  If already exist, ignore
    if (user.roomId){
      return;
    }

    userSetMessage('Connected to ' + roomId);
    console.info('Host found', roomId);
    user.roomId = roomId;

    //  Create Skylink room
    user.skylink = new Skylink();

    //  Init Skylink
    user.skylink.init({
      apiKey: 'eade5d29-b688-4b84-a570-137b8b7607f6',
      defaultRoom: user.roomId
    });

    //  Set listener host updated
    user.skylink.on('peerJoined', function(peerId, peerInfo){
      if (peerInfo.userData && peerInfo.userData.isHost){
        userReceiveHostInfo(peerId, peerInfo.userData);
      }
    });

    user.skylink.on('peerUpdated', function(peerId, peerInfo){
      if (peerInfo.userData && peerInfo.userData.isHost){
        userReceiveHostInfo(peerId, peerInfo.userData);
      }
    });

    //  Set listener when file received
    user.skylink.on('dataTransferState', function (state, transferId, peerId, transferInfo, error) {
      if (state === user.skylink.DATA_TRANSFER_STATE.UPLOAD_REQUEST) {
        user.skylink.respondBlobRequest(peerId, true);
        user.transferIds[transferId] = transferInfo;
        user.downloadedFileCount++;
      } 

      else if (state === user.skylink.DATA_TRANSFER_STATE.DOWNLOADING) {
        userSetProgress(transferId, parseInt(transferInfo.percentage));
      }	

      else if (state === user.skylink.DATA_TRANSFER_STATE.DOWNLOAD_COMPLETED) {
        var fileInfo = user.transferIds[transferId];
        userDownload(fileInfo.name, fileInfo.mimeType, transferInfo.data);
        delete user.transferIds[transferId];
        userSetProgress(transferId, 100);
      }	

      else if (error && error.message) {
        console.log(error.message);
      }
    });

    //  Start Skylink
    user.skylink.joinRoom();
  });

  //  Start Audiosign listener
  user.listener.start();
}



function userStopListening(){
  if (user.listener){
    user.listener.stop();
    delete user.listener;
  }
}



function userReceiveHostInfo(hostId, hostInfo){
  console.info('User Update Host', hostInfo);
  user.hostFiles = hostInfo.files;
  user.hostId = hostId;

  makeFileList(user.hostFiles);
}



function userSetMessage(message){
  document.getElementById('user').innerHTML = message;
}



function userRequestFile(file){
  user.skylink.sendMessage(file, user.hostId);
}




function userDownload(name, mimeType, blob){
	mimeType = mimeType || 'image/png';
	var reader = new FileReader();
  reader.onload = function(event){
  	var data = event.target.result;
  	data = data.substring(data.indexOf(',')+1);
	  var download = document.createElement('a');
	  download.href = window.URL.createObjectURL(blob);
	  download.download = name;
	  download.target = '_blank';
	  download.style.display = 'none';
	  document.body.appendChild(download);
	  download.click();
	  setTimeout(function(){
	    document.body.removeChild(download);
	  }, 0);
  };
  reader.onerror = function(){
  	console.log(arguments);
  }
  reader.readAsDataURL(blob);

}


var colors = ['#AEA8D3', '#CF000F', '#E87E04', '#F62459', '#663399', '#F7CA18', '#4183D7', '#1BA39C'];
function userSetProgress(targetId, percent){
	var target = document.getElementById(targetId);
	if (!target){
  	target = document.createElement('div');
  	target.className = 'progress';
  	target.id = targetId;
 		target.style.background = colors[user.downloadedFileCount % colors.length]
 		document.body.appendChild(target);
 	}

 	if (percent === 100){
 		target.remove();
 	} else {
  	target.style.width = percent + '%';
	}
}

