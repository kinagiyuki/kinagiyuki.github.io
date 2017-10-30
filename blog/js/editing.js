//=====================Variables definition=====================
var seletedID = "";


//=====================Functions definition=====================
function inputTitle(x) {
  $("#content-heading").html(x.value);
}

function inputHeadImage(x) {
  if(x!="")
    document.getElementById("head-image").src = x;
  else
    document.getElementById("head-image").src = defaultHeadImage;
}

//Copy to clipboard function
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

function insertBlogData(region) {
  //console.log("Inserting Blog data...");
  var blogLoad = $("#data-select");
  var init = $("<option value=''>[New Blog]</option>");
  blogLoad.append(init);
  if(blogData[region])
    for(var i=1;i<=blogData[region].length;i++)
    {
      var opt = $("<option></option>");
      opt.val(i).html("#"+i+": "+blogData[region][i-1].title);
      blogLoad.append(opt);
    }
  blogLoad.prop("selectedIndex",0);
}

function clearSelection() {
  //console.log("Clearing old data...");
  $("#data-select").empty();
}

function load() {
  console.log("Loading...");
  const region = (window.localStorage.getItem("_region"))?window.localStorage.getItem("_region"):"zh";
  var index = document.getElementById("data-select").selectedIndex;
  var blogLoad = document.getElementById("data-select")[index];
  if(blogLoad.value!="")
  {
    console.log("Not new");
    seletedID = blogLoad.value;
    var loadIndex = parseInt(seletedID)-1;
    if(blogData[region][loadIndex].headImage==null||blogData[region][loadIndex].headImage=="")
      document.getElementById("head-image").src = defaultHeadImage;
    else
    {
      document.getElementById("head-image").src = blogData[region][loadIndex].headImage;
      document.getElementById("head-image-input").value = blogData[region][loadIndex].headImage;
    }
    document.getElementById("content-heading").innerHTML = blogData[region][loadIndex].title;
    document.getElementById("title").value = blogData[region][loadIndex].title;
    document.getElementById("blog-date").value = blogData[region][loadIndex].date;
    inputContent(blogData[region][loadIndex].content,'insert');
    inputDate(blogData[region][loadIndex].date);
    document.getElementById("content-input").value = blogData[region][loadIndex].content;
    document.getElementById("public").checked = (blogData[region][loadIndex].public=="Yes")?true:false;
  }
  else
  {
    console.log("New");
    seletedID = "";
    document.getElementById("head-image").src = defaultHeadImage;
    document.getElementById("content-heading").innerHTML = "New blog";
    document.getElementById("title").value = "";
    document.getElementById("blog-date").value = new Date().toString();
    inputContent("New blog content",'insert');
    document.getElementById("content-input").value = "";
    document.getElementById("public").checked = false;
  }
}

function save() {
  const region = (window.localStorage.getItem("_region"))?window.localStorage.getItem("_region"):"zh";
  var isNew = false;
  var inputHeadImage = $("#head-image-input").val();
  var inputTitle = $("#title").val();
  var inputDate = $("#blog-date").val();
  var intputContent = $("#content-input").val();
  var isPublic = ($("#public").prop("checked"))?"Yes":"No";
  if(seletedID == "" || seletedID > blogData[region].length)  //New blog content
  {
      console.log("New Blog");
      firebase.database().ref('blogs/'+region+'/' + ((blogData[region])?(blogData[region].length+1):"1") ).set({
      title: inputTitle,
      headImage:　inputHeadImage,
      date: inputDate,
      content: intputContent,
      public: isPublic
    });
  }
  else
  {
    console.log("Old Blog");
    var saveBlog = {
      title: inputTitle,
      headImage: inputHeadImage,
      date: inputDate,
      content: intputContent,
      public: isPublic
    };
    var update = {};
    update["blogs/"+region+"/"+seletedID] = saveBlog;
    var result = firebase.database().ref().update(update);
    console.log(result);
  }
}

function changeRegion()
{
  var selected = $("#region-select :selected").val();
  window.localStorage.setItem("_region",selected);
  clearSelection();
  insertBlogData(selected);
}

//==================== Firebase related ==============================
function logIn() {
  const Email = $("#login-email").val();
  const Password = $("#login-password").val();
  const region = ["zh","jp"];

  firebase.auth().signInWithEmailAndPassword(Email, Password).then(function(user) {

    firebase.database().ref('blogs/').once('value').then(function(snapshot) {
      for(var i=0;i<region.length;i++)
      {
        var temp = snapshot.val()[region[i]];
        if(!temp)
          continue;
        blogData[region[i]] = new Array();
        var count = 1;
        while(temp[count]!=null)
          blogData[region[i]].push(temp[count++]);
      }
      /*var i=1;
      blogData = new Array();
      while(snapshot.val()[i]!=null)
        blogData.push(snapshot.val()[i++]);*/
      clearSelection();
      insertBlogData("zh");
    });

    $("#login-form").css("display","none");
    $("#edit-form").css("display","block");

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    alert(errorMessage);
  });
}

function logOut() {

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    $("#login-email").val("");
    $("#login-password").val("");
    $("#edit-form").css("display","none");
    $("#login-form").css("display","block");
  }, function(error) {
    // An error happened.
    alert("Something goes wrong");
  });

}

//Event Attach
$("#login-password").keypress(function(e){
  const key = e.which;
  if(key==13)
    $("#login").click();
});

//===================== End of function definition ============================

//Initialize Firebase
initalizeFirebase();

firebase.auth().onAuthStateChanged(function(user) {
  if(user)
    if(blogData[0]==null)
    {
      blogData = new Array();
      firebase.database().ref('blogs/zh/').once('value').then(function(snapshot) {
        var i=1;
        //console.log(snapshot.val());
        while(snapshot.val()[i]!=null)
          blogData.push(snapshot.val()[i++]);
        clearSelection();
        insertBlogData();
      });
    }
});

/*window.onload = function() {
  document.getElementById("edit-form").style.display = "none";
}*/