//======================Functions and variables declaration and definition==================


//====================================Start of Main JS======================================

//Initialize Firebase
initalizeFirebase();
//console.log("Connected to Firebase");

//Loading and inserting blog data from Firebase
region = (window.localStorage.getItem("_region"))?window.localStorage.getItem("_region"):"zh";
loadAndInsertBlogData("all",null,region);
delete region;
//blogData = "";