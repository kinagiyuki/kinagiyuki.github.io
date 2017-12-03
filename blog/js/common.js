//Common global variable define
var defaultHeadImage = "https://i.imgur.com/Sr26svx.jpg";
var blogData = new Array();
var tagData = new Array();
tagData['[img]'] = "<div class=\"photo\">\n"+
  "<img src=\"img/tape02.jpg\" class=\"tape\">\n" + 
  "<img src=\"[url]\" class=\"img-responsive center-block photo-style\">\n"+
  "</div>\n";
tagData['[link]'] = "<a href=\"[url]\">[content]</a>";
//tagData['[dl]'] = "<p class='dl'>▼△▼△▼△▼△▼△▼△▼△▼△▼△▼△▼△▼△</p>\n";
tagData['[dl]'] = "<p class=\"dl\"><line></line></p>";

if(window.location.href.indexOf("/jp/")>-1)
  window.localStorage.setItem("_region","jp");
else
  window.localStorage.setItem("_region","zh");

//======================Function declaration and definition==================
function inputDate(x) {
  var target = $("#content-body");
  target.html("<p class=\"date\">" + x + "</p>\n" + target.html());
}

function inputContent(x,mode) {
  var inputArray = x.split(/\r\n|\r|\n/g);
  var content = "";
  var isQuote = false;

  for(var i=0;i<inputArray.length;i++)
  {
    var tag = inputArray[i].match(/\[\w*\]/ig);
    //console.log(tag);

    if(isQuote)
    {
      if(inputArray[i].lastIndexOf("//")==(inputArray[i].length-2))
      {
        if(inputArray[i].indexOf("[by]")>=0)
          content += "<br>\n" + inputArray[i].substring(0,inputArray[i].indexOf("[by]")) + "<small>"+ inputArray[i].substring(inputArray[i].indexOf("[by]")+4).replace("//","") + "</small></quote>\n";
        else
          content += "<br>\n" + inputArray[i].replace("//","") + "</quote>\n";
        isQuote = false;
      }
      else
        content += "<br>\n" + inputArray[i];
    }
    else //Not Quote
    {
      if(inputArray[i].indexOf("//")==0 && inputArray[i].lastIndexOf("//")==(inputArray[i].length-2))
      {
        if(inputArray[i].indexOf("[by]")>=0)
          content += "<quote>" + inputArray[i].substring(2,inputArray[i].indexOf("[by]")) + "<small>"+ inputArray[i].substring(inputArray[i].indexOf("[by]")+4).replace("//","") + "</small></quote>\n";
        else
          content += "<quote>" + inputArray[i].substring(2).replace("//","") + "</quote>\n";
      }
      else if(inputArray[i].indexOf("//")==0)
      {
        isQuote = true;
        content += "<quote>" + inputArray[i].substring(2);
      }
      else if(tag!=null)
      {
        if(tag=="[img]")
          content += tagData[tag].replace("[url]",inputArray[i].replace(tag,""));
        else if(tag=="[dl]")
          content += tagData[tag];
        else if(tag[0]=="[link]")
        {
          var tagHandle = inputArray[i];
          content += "<p>" + tagHandle.substring(0,tagHandle.indexOf("[link]"));
          for(var j=0;j<tag.length;j++)
          {
            var linkDetail = tagHandle.substring(tagHandle.indexOf("[link]")+"[link]".length,tagHandle.indexOf("[/]")).split(",");
            content += tagData[tag[j]].replace("[url]",linkDetail[0]).replace("[content]",linkDetail[1]);
            tagHandle = tagHandle.substring(tagHandle.indexOf("[/]")+3);
            content += (tagHandle!="")?((j<tag.length-1)?tagHandle.substring(0,tagHandle.indexOf("[link]")):tagHandle):"";
            tagHandle = (tagHandle!="")?((j<tag.length-1)?tagHandle.substring(tagHandle.indexOf("[link]")+"[link]".length):tagHandle):"";
          }
          content += "</p>\n";
        }
      }
      else
        content += "<p>" + inputArray[i] + "</p>\n";
    }
  }
  //console.clear();
  //console.log(content);
  if(mode=='insert')
    $("#content-body").html(content);
  else if(mode=='tape-out')
  {
    copyTextToClipboard(content);
  }
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

//Mobile navigate menu related function
function switchMobileNav()
{
  var target = $("#mobile-nav-wrapper")[0].style;
  if(target.transform!="translate(0px, 0px)")
  {
    target.transform = "translate(0,0)";
    target.boxShadow  = "0px 3px 3px rgba(86,36,36,0.5)";
    $(".mobile-nav").css("opacity","1").css("border-radius", "0px");
    $("#mobile-nav-icon").removeClass("glyphicon-th").addClass("glyphicon-remove");
    setTimeout(function(){
      $("#mobile-nav-content").css("opacity","1");
    },250);
  }
  else
  {
    $("#mobile-nav-content").css("opacity","0");
    setTimeout(function(){
      //target.transform = "translate(100%,-100%)";
      target.transform = "translate(0,-100%)";
      target.boxShadow  = "0 0 0 grey";
      $("#mobile-nav-icon").removeClass("glyphicon-remove").addClass("glyphicon-th");
      setTimeout(function() {
        $(".mobile-nav").css("opacity","0.5").css("border-radius", "25px");
      },150);
      
    },100);
  }
  //target.width = "100%";
  //target.height = "400px";
}

//==================== Firebase related ==============================
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

function insertBlogData(mode)
{
  for(var i=blogData.length-1;i>=0;i--)
  {
    const title = blogData[i].title;
    const date = blogData[i].date;
    const BID = i+1;
    const content = "<p class='title-"+((i%2)?"A":"B")+"'><a href=\"blog.html?blog="+BID+"\">"+title+" - "+date+"</a></p>";
    const memoContent = "<p><a href=\"blog.html?blog="+BID+"\">"+title+"</a></p>";
    if(mode=="all" || mode=="menu")
      $("#content-body")[0].innerHTML += content;
    if(mode=="all" || mode=="memo")
    {
      $("#memo-inside")[0].innerHTML += memoContent;
      $("#mobile-recent-blog-content")[0].innerHTML += memoContent;
    }
  }
  //console.log("Blog Data inserted");
}

function loadAndInsertBlogData(mode,after,region)
{
  firebase.database().ref('blogs/'+region+'/').once('value').then(function(snapshot) {
  //console.log(snapshot.val());
  var i=1;
  //blogData = new Array();
  while(snapshot.val()[i]!=null)
  {
    if(snapshot.val()[i].public=="Yes")
      blogData.push(snapshot.val()[i]);
    i++;
  }

  //Insert into page
  insertBlogData(mode);
  
  if(after!=null)
    after();

  blogData = "";
  });
  //console.log("Blog Data loaded");
}

//============================Start of Main JS===============================

$(window).scroll(function() {
	var width = window.innerWidth || document.body.clientWidth;
	width = (width-1070)/2 - 44;
  //width = (width-1070)/2 - 88;

  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) 
  {
    if($(this).scrollTop() > 500)
    {
      $('#menu-col').addClass('menu-col');
      document.getElementsByClassName("menu-col")[0].style.right = width+"px";
    }
    else 
      $('#menu-col').removeClass('menu-col');
  }
	
});

