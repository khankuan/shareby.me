
function prevent(e){
  e.stopPropagation();
  e.preventDefault();
}


document.addEventListener("DOMContentLoaded", function(event) { 
  makeSessionUser();
  document.body.addEventListener("dragover", prevent, false);
  document.body.addEventListener("dragleave", prevent, false);
  document.body.addEventListener("drop", makeSessionHost, false);
});



function makeSessionHost(e){
  prevent(e);

  //  Remove user
  if (document.getElementById('user')){
    document.getElementById('user').remove();
  }
  userStopListening();

  //  Create host if not exist
  if (!document.getElementById('host')){
    var hostElement = document.createElement('div');
    hostElement.id = 'host';
    hostElement.innerHTML = '<span>Drop more files..</span>';
    document.body.appendChild(hostElement);
  }
  hostDroppedFiles(e);
}



function makeSessionUser(){
  var userElement = document.createElement('div');
  userElement.id = 'user';
  userElement.innerHTML = '<span>Drop some files or wait for others..</span>';

  document.body.appendChild(userElement);
  userStartListening();
}




function makeFileList(files){
  //  Remove old files
  if (document.getElementById('files')){
    document.getElementById('files').remove();
  }

  //  Add new files
  var filesElement = document.createElement('div');
  filesElement.id = 'files';

  for (var i in files){
    var file = files[i];
    var fileElement = document.createElement('a');
    fileElement.href = '#';
    fileElement.innerHTML = file.name + ' ' + Math.round(file.size/1024/1024*100, 2)/100 + 'mb ';
    if (!host.broadcaster){
      fileElement.onclick = userRequestFile.bind(null, file);
    }

    var fileElementWrapper = document.createElement('p');
    fileElementWrapper.appendChild(fileElement);
    filesElement.appendChild(fileElementWrapper);
  }

  document.body.appendChild(filesElement);
}
