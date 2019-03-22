"use strict";

var backgroundUrl = 'https://source.unsplash.com/featured/1440x960/?';
var backgroundKeyword = 'wolf';
var element1 = document.getElementById("preload");
var element2 = document.getElementById("bg");
var backgroundRefresh;
var backgroundKeyword;

window.onload = function() {
};

function initBG() {
	var d = new Date();
    element2.style.background = document.defaultView.getComputedStyle(element1).background;
	element1.style.background = 'url('+backgroundUrl+backgroundKeyword+'&t='+d.getTime()+')';
}

var myInterval = undefined,
swapBG = function(){
	myInterval = setInterval(function(){
		var d = new Date();
		element2.style.background = document.defaultView.getComputedStyle(element1).background;
		element1.style.background = 'url('+backgroundUrl+backgroundKeyword+'&t='+d.getTime()+')';
	}, backgroundRefresh * 1000);
}

function displayClock() {
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var today = new Date();
	var weekday = days[ today.getDay() ];
	var monthday = today.getDate();
	var month = months[ today.getMonth() ];
	var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var ampm = getAMPM(h);
    m = checkTimeProperty(m); // Add leading 0 for minutes > 10
    h = convertToTwelveHr(h); // Convert to 12hr format
    document.getElementById("clock").innerHTML = "<span id='day'>" + weekday + "</span><span id='time'>" + h + "<span class='blink'>:</span>" + m + " " + ampm + "</span><span id='date'>" + month + " " + monthday + ", " + year;
    var t = setTimeout(displayClock, 15000); // Run every 15 seconds
}
function checkTimeProperty(m) {
    if (m < 10)
        m = "0" + m;
    return m;
}
function convertToTwelveHr(h) {
    if (h > 12) {
        return h - 12;
    }
    if (h == 0)
        return 12;
    return h;
}
function getAMPM(h) {
    if (h < 12)
        return "AM";
    if (h >= 12)
        return "PM";
}

document.getElementById('refreshBtn').addEventListener('click', function () {
	if(typeof myInterval != 'undefined'){ clearInterval(myInterval); }
	initBG();
	swapBG();
});

chrome.storage.local.get({
    'backgroundImage': '', 'sites': [], 'showBookmarkNames': 'always',
    'bookmarkPosition': 'middle',
	'backgroundRefresh': '15',
	'backgroundKeyword': 'dog'
}, function (data) {
	backgroundRefresh = data.backgroundRefresh;
	backgroundKeyword = data.backgroundKeyword;
	element1.style.background = 'url('+backgroundUrl+backgroundKeyword+')';
	initBG();
	displayClock();
	swapBG();
    // Set background image
    //document.body.style.backgroundImage = "url('" + data.backgroundImage + "')";

    document.getElementById('optionsBtn').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    // Load bookmarks
    var bookmarkContainer = document.getElementById('linksContainer');
    for (let i = 0; i < data.sites.length; i++) {
        let newImage = new Image();
        let imgUrl = data.sites[i].url;
        let linkText = data.sites[i].name;
        newImage.src = data.sites[i].imgUrl;
        newImage.id = 'link-' + i;
        newImage.className = 'linkImg';
        let newDiv = document.createElement('div');
        newDiv.className = 'link';
        newDiv.addEventListener('click', () =>
            chrome.tabs.update({ url: imgUrl })
        );
        let newSpan = document.createElement('span');
        newSpan.innerText = linkText;
        newSpan.className = 'linkText';
        bookmarkContainer.appendChild(newDiv);
        newDiv.appendChild(newImage);
        newDiv.appendChild(newSpan);
    }

    // Update behavior of bookmark names depending on user settings
    // Default behavior is show names on ---hover--- always
    var showNames = data.showBookmarkNames;
    if (showNames !== 'always') {
        var elements = document.querySelectorAll('.linkText');
        var nameOpacity = showNames === 'always' ? 0 : 1;
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.opacity = nameOpacity;
        }
    }

    var bookmarkPosition = data.bookmarkPosition;
    if (bookmarkPosition === 'top') {
        bookmarkContainer.style.marginTop = '50px';
    } else if (bookmarkPosition === 'middle') {
        //bookmarkContainer.style.marginTop = '45vh';//((window.innerHeight / 2) - 80) + 'px';
    } else {
        bookmarkContainer.style.position = 'absolute';
        bookmarkContainer.style.bottom = '10px';
    }
});
