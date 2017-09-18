//======================Function declaration and definition==================
function inputDate(x) {
  var target = document.getElementById("content-body");
  target.innerHTML = "<p class=\"date\">" + x + "</p>\n" + target.innerHTML;
}

function inputContent(x,mode) {
  var inputArray = x.split(/\r\n|\r|\n/g);
  var content = "";
  for(var i=0;i<inputArray.length;i++)
  {
    if(inputArray[i].indexOf("//")==0 && inputArray[i].lastIndexOf("//")==(inputArray[i].length-2))
      content += "<quote>" + inputArray[i].substring(2).replace("//","") + "</quote>\n";
    else
      content += "<p>" + inputArray[i] + "</p>\n";
  }
  console.clear();
  console.log(content);
  if(mode=='insert')
  {
    var target = document.getElementById("content-body");
    target.innerHTML =  content;
  }
  else if(mode=='tape-out')
  {
    copyTextToClipboard(content);
  }
}

function initalizeFirebase() {
  if (firebase.apps.length === 0) {
      var config = {
      apiKey: "AIzaSyDMex4kJKNjKVaa8FK9B0z4JXjQ3qSjg7s",
      authDomain: "main-blog-4cdad.firebaseapp.com",
      databaseURL: "https://main-blog-4cdad.firebaseio.com",
      projectId: "main-blog-4cdad",
      storageBucket: "main-blog-4cdad.appspot.com",
      messagingSenderId: "261910555177"
    };
    firebase.initializeApp(config);
  }
}

//============================Start of Main JS===============================

$(window).scroll(function() {
	var width = window.innerWidth || document.body.clientWidth;
	width = (width-1070)/2 - 49;

	if($(this).scrollTop() > 500)
	{
		$('#menu-col').addClass('menu-col');
		document.getElementsByClassName("menu-col")[0].style.right = width+"px";
	}
	else 
		$('#menu-col').removeClass('menu-col');
});