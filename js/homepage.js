//Helper function
var getRandomMsRange = function(min, max) {
  return Math.random() * (max - min) + min;
}


//Initilization
document.getElementById("student-card").style.display = "none";
document.getElementById("notebook").style.display = "none";
var skip = document.getElementById("skip");
var notice = document.getElementById("notice");


//Preparing animation
var wrapperChange = document.getElementById("wrapper").animate([
	{'background': 'black'},
	{'background': 'grey', offset: 0.75},
	{'background': 'rgba(0,0,0,0.0)'}
	],{
		duration: 3000,
		iterations: 1
});
wrapperChange.pause();

var studentCardAnimation = document.getElementById("student-card").animate([
	{transform: 'translate(-100%, 200%) rotate(360deg)', opacity: 0},
	{transform: 'translate(-15%, 60%) rotate(15deg)', opacity: 1}
	],{
		duration: 500
	});
studentCardAnimation.pause();

var notebookAnimation = document.getElementById("notebook").animate([
	{transform: 'translate(-25%, -200%) rotate(-30deg)', opacity: 0},
	{transform: 'translate(25%, 0%) rotate(-30deg)', opacity: 1}
	],{
		duration: 500,
		easing: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
	});
notebookAnimation.pause();

var noticePopUp = document.getElementById("notice").animate([
	{transform: 'translate(0,500%)'},
	{transform: 'translate(0,0)'}
	],{
		duration: 1000,
		easing: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
	});
noticePopUp.pause();

var petals = document.querySelectorAll('.petal');
petals = Array.prototype.slice.call(petals);

petals.forEach(function(el) {  
  el.animate(
    [{ transform: 'translate3D('+getRandomMsRange(-5,5)+'%, 0, 0)' }, 
  	{ transform: 'translate3D('+getRandomMsRange(-10,10)+'%, 1000%, 0)' }
    ],
    {
      delay: getRandomMsRange(-1000, 1000), // randomized for each tear
      duration: getRandomMsRange(1500, 2000), // randomized for each tear
      iterations: 5
    });
  el.playState = 'paused';
});

var sakuraScene = document.getElementById("sakura").animate(
	[{opacity: 0},
	 {opacity: 0, offset: .2},
	 {opacity: 1, offset: .4},
	 {opacity: 1, offset: .9},
	 {opacity: 0}
	], {
		duration: 3500,
		fill: 'forwards',
		easing: 'ease-in'
	});
sakuraScene.pause();

var showSentense = document.getElementById("title").animate([
	{opacity: 0},
	{opacity: 1, offset: 0.3},
	{opacity: 1, offset: 0.8},
	{opacity: 0}
	], {
		delay: 500,
		duration: 2000,
		iterations: 1,
		fill: 'forwards'
});
showSentense.pause();

var endOfShowingSentense = function() 
{
	wrapperChange.play();
	sakuraScene.play();
	petals.forEach(function(el) {  
      el.playState = 'playing';
    });
}
showSentense.onfinish = endOfShowingSentense;

var showNote = function()
{
	document.getElementById("wrapper").style.display = 'none';
	document.getElementById("notebook").style.display = "block";
	notebookAnimation.play();
}
wrapperChange.onfinish = showNote;
sakuraScene.onfinish = function(){document.getElementById("sakura").style.display = 'none';}

var showCardAndNotice = function()
{
	skip.style.display = "none";
	document.getElementById("student-card").style.display = "block";
	document.getElementById("notice").style.display = "block";
	studentCardAnimation.play();
	noticePopUp.play();
}
notebookAnimation.onfinish = showCardAndNotice;

var skipAll = function()
{
	showSentense.cancel();
	wrapperChange.finish();
	sakuraScene.finish();
	skip.style.display = "none";
	//notice.style.display = "block";
}
skip.addEventListener("mousedown", skipAll, false);

window.onload = function() {
	showSentense.play();
	var skip_btn = document.getElementById('skip');
	skip_btn.innerHTML = "Skip<span class=\"glyphicon glyphicon-forward\" aria-hidden=\"true\" style=\"padding-left: 10px;\"></span>";
	$('#skip').removeClass('disable');
}


//======================Homepage function===================
function open(input) {
	document.getElementById(input).style.visibility = "visible";
	document.getElementById(input).style.display = "block"
}

function close(input) {
	document.getElementById(input).style.visibility = "hidden";
	document.getElementById(input).style.display = "none";
}