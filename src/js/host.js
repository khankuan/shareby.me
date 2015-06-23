var host = {
  files: []
};



function hostStartBroadcasting(){

  //  Start audiosign broadcaster
  host.broadcaster = new AudioSign.AudioSignBroadcaster({
    size: 56,
    step: 22
  });
  host.broadcaster.start();

  console.info('Host started', host.broadcaster.id);
  hostSetMessage(host.broadcaster.id);

  //  Create Skylink room
  host.skylink = new Skylink();

  //  Init Skylink
  host.skylink.init({
    apiKey: 'eade5d29-b688-4b84-a570-137b8b7607f6',
    defaultRoom: host.broadcaster.id
  });

  //  Set listener host self joined
  host.skylink.on('peerJoined', function(peerId, peerInfo, isSelf){
    if (isSelf){
      updateHost();
    }
  });

  //  Set listener for request
  host.skylink.on('incomingMessage', function(message, peerId){
    var file = host.files[message.content.index];
    host.skylink.sendBlobData(file, {
      name: file.name,
      size: file.size,
      mimeType: file.type
    }, peerId);
  });

  //  Start Skylink
  host.skylink.joinRoom();
}



function hostDroppedFiles(e){
  if (!host.broadcaster){
    hostStartBroadcasting();
  }

  var files = e.target.files || e.dataTransfer.files;
  for (var i = 0; i < files.length; i++) {
    host.files.push(files[i]);
  }
  updateHost();
}



function updateHost(){
  var hostInfo = {
    files: host.files.map(function(f, i){
      return {
        name: f.name,
        size: f.size,
        index: i
      }
    }),
    isHost: true
  }
  console.info('Host updated', hostInfo);
  host.skylink.setUserData(hostInfo);

  makeFileList(hostInfo.files);
}



function hostSetMessage(message){
  document.getElementById('host').innerHTML = '<span>Host ' + message + '<br>Drop or click for more files..</span>';
}