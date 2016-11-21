(window.onload = function(){
	var uploadButton = document.getElementById('upload-button');
	uploadButton.addEventListener('click', function () {
		var uploadFile = document.getElementById('upload-icon');
		if(document.getElementById('check-twitter').checked){
				console.log("twitter is true");
				console.log(uploadFile);
		}
		if(document.getElementById('check-github').checked){
				console.log("github is true");
		}
	})
})
