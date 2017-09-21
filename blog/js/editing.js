var blogData = new Array();
var seletedID = "";

function inputTitle(x) {
	var inputText = x.value;
	var title = document.getElementById("content-heading");
	title.innerHTML = inputText;
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

function insertBlogData() {
  console.log("Inserting Blog data...");
  var blogLoad = document.getElementById("data-select");
  var init = document.createElement("option");
  init.value = "";
  init.innerHTML = "[New Blog]";
  blogLoad.appendChild(init);
  for(var i=1;i<=blogData.length;i++)
  {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = "#"+i+": "+blogData[i-1].title;
    blogLoad.appendChild(opt);
  }
}

function clearSelection() {
  console.log("Clearing old data...");
  var blogLoad = document.getElementById("data-select");
  for(var i=0;i<blogLoad.options.length;i++)
    blogLoad.remove(i);
}

function load() {
  console.log("Loading...");
  var blogLoad = document.getElementById("data-select");
  for(var i=0;i<blogLoad.length;i++)
    if(blogLoad[i].selected == true)
      if(blogLoad[i].value!="")
      {
        console.log("Not new");
        seletedID = blogLoad[i].value;
        if(blogData[parseInt(seletedID)-1].headImage==null)
          document.getElementById("head-image").src = defaultHeadImage;
        else
        {
          document.getElementById("head-image").src = blogData[parseInt(seletedID)-1].headImage;
          document.getElementById("head-image-input").value = blogData[parseInt(seletedID)-1].headImage;
        }
        document.getElementById("content-heading").innerHTML = blogData[parseInt(seletedID)-1].title;
        document.getElementById("title").value = blogData[parseInt(seletedID)-1].title;
        document.getElementById("blog-date").value = blogData[parseInt(seletedID)-1].date;
        inputContent(blogData[parseInt(seletedID)-1].content,'insert');
        inputDate(blogData[parseInt(seletedID)-1].date);
        document.getElementById("content-input").value = blogData[parseInt(seletedID)-1].content;
        break;
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
        break;
      }
}

function save() {
  var isNew = false;
  var inputHeadImage = document.getElementById("head-image-input").value;
  var inputTitle = document.getElementById("title").value;
  var inputDate = document.getElementById("blog-date").value;
  var intputContent = document.getElementById("content-input").value;
  var isPublic = (document.getElementById("public").checked)?"Yes":"No";
  if(seletedID == "" || seletedID > blogData.length)  //New blog content
  {
      console.log("New Blog");
      firebase.database().ref('blogs/zh/' + (blogData.length+1) ).set({
      title: inputTitle,
      headImage:　"",
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
    update["blogs/zh/"+seletedID] = saveBlog;
    var result = firebase.database().ref().update(update);
    console.log(result);
  }
}

//==================== Firebase related ==============================
function logIn() {
  var Email = document.getElementById("login-email").value;
  var Password = document.getElementById("login-password").value;

  firebase.auth().signInWithEmailAndPassword(Email, Password).then(function(user) {

    firebase.database().ref('blogs/zh/').once('value').then(function(snapshot) {
      var i=1;
      blogData = new Array();
      console.log(snapshot.val());
      while(snapshot.val()[i]!=null)
        blogData.push(snapshot.val()[i++]);
      clearSelection();
      insertBlogData();
    });

    document.getElementById("login-form").style.display = "none";
    document.getElementById("edit-form").style.display = "block";

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
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
    document.getElementById("edit-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";   
  }, function(error) {
    // An error happened.
    alert("Something goes wrong");
  });

}

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
        console.log(snapshot.val());
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