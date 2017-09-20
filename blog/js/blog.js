//======================Functions and variables declaration and definition==================
var blogData = new Array();

function loadAndInsertBlogData(BID)
{
	firebase.database().ref("blogs/zh/"+BID+"/").once('value').then(function(snapshot) {
		//console.log(snapshot.val());
		if(snapshot.val()!=null)
		{
			document.getElementById("content-heading").innerHTML = snapshot.val().title;
			if(snapshot.val().headImage==null)
	          document.getElementById("head-image").src = defaultHeadImage;
	        else
	          document.getElementById("head-image").src = snapshot.val().headImage;
			inputContent(snapshot.val().content,'insert');
			inputDate(snapshot.val().date);
		}
	});
	//console.log("Blog Data loaded");
}

function getParameterByName(name) 
{
	var url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//====================================Start of Main JS======================================

//Initialize Firebase
initalizeFirebase();
//console.log("Connected to Firebase");

var BID = getParameterByName("blog");

//Loading and inserting blog data from Firebase
loadAndInsertBlogData(BID);