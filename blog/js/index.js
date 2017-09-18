//======================Functions and variables declaration and definition==================
var blogData = new Array();

function insertBlogData()
{
	for(var i=blogData.length-1;i>=0;i--)
	{
		const title = blogData[i].title;
		const date = blogData[i].date;
		const BID = i+1;
		const content = "<p><a href=\"blog.html?blog="+BID+"\">"+title+" - "+date+"</a></p>";
		document.getElementById("content-body").innerHTML += content;
		document.getElementById("memo-inside").innerHTML += content;
	}
	//console.log("Blog Data inserted");
}

function loadAndInsertBlogData()
{
	firebase.database().ref('blogs/zh/').once('value').then(function(snapshot) {
	//console.log(snapshot.val());
	var i=1;
	//blogData = new Array();
	while(snapshot.val()[i]!=null)
		blogData.push(snapshot.val()[i++]);

	//Insert into page
	insertBlogData();
	});
	//console.log("Blog Data loaded");
}

//====================================Start of Main JS======================================

//Initialize Firebase
initalizeFirebase();
//console.log("Connected to Firebase");

//Loading and inserting blog data from Firebase
loadAndInsertBlogData();