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
	document.title = singleInput.title + " - "+$("title").html();
	if(singleInput.headImage==null)
		document.getElementById("head-image").src = defaultHeadImage;
	else
		document.getElementById("head-image").src = singleInput.headImage;
	inputContent(singleInput.content,'insert');
	inputDate(singleInput.date);

	var url = window.location.href.toString();
	var twitter = document.getElementById("twitter-share");
	var mobileTwitter = document.getElementById("mobile-twitter-share");
	var content = "<a href=\"https://twitter.com/share?ref_src=twsrc%5Etfw\" "+
	"class=\"twitter-share-button\" data-text=\""+singleInput.title+"\n\" data-hashtags=\"kinagiyuki_blog\" "+
	"data-show-count=\"false\">Tweet</a>"+
	"<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-\8\"></script>";
	//var span = document.createElement("span");
	//span.innerHTML = content;
	//twitter.appendChild(span);
	twitter.innerHTML += content;
	mobileTwitter.innerHTML += content;

	$.ajax({ url: 'http://platform.twitter.com/widgets.js', dataType: 'script', cache:true});
	

	//window.twttr.widgets.load();

	blogData = "";
}

//====================================Start of Main JS======================================
if(getParameterByName("blog")==null || getParameterByName("blog") == "")
	window.location.href = "/blog/";
//Initialize Firebase
initalizeFirebase();

//Loading and inserting blog data from Firebase
//$.when(loadAndInsertBlogData("memo")).then(loadSingleBlog(BID));
region = (window.localStorage.getItem("_region"))?window.localStorage.getItem("_region"):"zh";
loadAndInsertBlogData("memo", loadSingleBlog, region);
delete region;
//loadSingleBlog(BID);