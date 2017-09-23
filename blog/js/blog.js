//======================Functions and variables declaration and definition==================

function loadSingleBlog()
{
	//if(blogData[0]!=null)
	var BID = getParameterByName("blog");
	var singleInput = blogData[parseInt(BID)-1];
	if(singleInput == undefined)
		window.location.href="/blog"
	;
	document.getElementById("content-heading").innerHTML = singleInput.title;
	if(singleInput.headImage==null)
		document.getElementById("head-image").src = defaultHeadImage;
	else
		document.getElementById("head-image").src = singleInput.headImage;
	inputContent(singleInput.content,'insert');
	inputDate(singleInput.date);
}

//====================================Start of Main JS======================================

//Initialize Firebase
initalizeFirebase();

//Loading and inserting blog data from Firebase
//$.when(loadAndInsertBlogData("memo")).then(loadSingleBlog(BID));
loadAndInsertBlogData("memo",loadSingleBlog);
//loadSingleBlog(BID);