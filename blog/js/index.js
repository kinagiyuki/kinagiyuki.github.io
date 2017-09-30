//======================Functions and variables declaration and definition==================


//====================================Start of Main JS======================================

//Initialize Firebase
initalizeFirebase();
//console.log("Connected to Firebase");

//Loading and inserting blog data from Firebase
loadAndInsertBlogData("all");
blogData = "";