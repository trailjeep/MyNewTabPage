"use strict";

chrome.runtime.onInstalled.addListener(function (details) {

    var sites =
        [
            { name: 'Gmail', url: 'https://mail.google.com/', imgUrl: 'email.png', id: 0 },
			{ name: 'Calendar', url: 'https://calendar.google.com/', imgUrl: 'calendar.png', id: 1 },
			{ name: 'Contacts', url: 'https://contacts.google.com/', imgUrl: 'contacts.png', id: 2 },
			{ name: 'News', url: 'https://news.google.com/', imgUrl: 'news.png', id: 3 },
			{ name: 'Weather', url: 'https://www.google.com/search?q=weather', imgUrl: 'weather.png', id: 4 },
			{ name: 'Sacco.me', url: 'https://sacco.me/', imgUrl: 'paw.png', id: 5 },
			{ name: 'Router', url: 'http://192.168.1.1/', imgUrl: 'router.png', id: 6 },
			{ name: 'Scan', url: 'http://192.168.1.20/#hId-webscanPage', imgUrl: 'printer.png', id: 7 },
			{ name: 'NAS', url: 'http://taz:8080/cgi-bin/html/login.html', imgUrl: 'ts209.png', id: 8 },
			{ name: 'Walgreens Refill', url: 'https://img.walgreens.com/pharmacy/order/express-refills.jsp', imgUrl: 'walgreens.png', id: 9 },
			{ name: 'Baxter Sharesource', url: 'https://na.sharesource.com/', imgUrl: 'baxter.png', id: 10 },
			{ name: 'Baxter Driver Alert', url: 'https://driveralert.baxter.com/', imgUrl: 'baxter.png', id: 11 },
			{ name: 'Google Keep', url: 'https://keep.google.com/', imgUrl: 'keep.png', id: 12 },
			{ name: 'Google Drive', url: 'https://drive.google.com/drive/', imgUrl: 'drive.png', id: 13 },
			{ name: 'Dropbox', url: 'https://www.dropbox.com/h', imgUrl: 'dropbox.png', id: 14 },
			{ name: 'North Cove Yacht Club', url: 'http://www.northcoveyc.com/', imgUrl: 'ncyc.png', id: 15 },
			{ name: 'ESPN', url: 'http://www.espn.com/', imgUrl: 'espn.png', id: 16 },
			{ name: 'Pearce Email', url: 'https://apps.rackspace.com/index.php', imgUrl: 'pearce.png', id: 17 },
			{ name: 'Pearce', url: 'https://www.hpearce.com/', imgUrl: 'pearce.png', id: 18 },
			{ name: 'CTMLS', url: 'https://idp.ctmls.safemls.net/idp/Authn/UserPassword', imgUrl: 'ctmls.png', id: 19 },
			{ name: 'Homesnap', url: 'https://www.homesnap.com/', imgUrl: 'homesnap.png', id: 20 },
			{ name: 'Photos', url: 'https://photos.google.com/', imgUrl: 'photos.png', id: 21 },
			{ name: 'Mahjong', url: 'http://www.247mahjong.com/?chromestore=1', imgUrl: 'mahjong.png', id: 22 }
        ];
    var icons =
        [
			{ name: 'Default', imgUrl: 'default.png' },
            { name: 'Facebook social media', imgUrl: 'facebook.png' },
            { name: 'Twitter social media', imgUrl: 'twitter.png' },
			{ name: 'Amazon', imgUrl: 'amazon.png' },
			{ name: 'Baxter', imgUrl: 'baxter.png' },
			{ name: 'Email', imgUrl: 'email.png' },
			{ name: 'Calendar', imgUrl: 'calendar.png' },
			{ name: 'CodePen', imgUrl: 'codepen.png' },
			{ name: 'Contacts', imgUrl: 'contacts.png' },
			{ name: 'CT MLS', imgUrl: 'ctmls.png' },
			{ name: 'Drive', imgUrl: 'drive.png' },
			{ name: 'Dropbox', imgUrl: 'dropbox.png' },
			{ name: 'ESPN', imgUrl: 'espn.png' },
			{ name: 'GitHub', imgUrl: 'github.png' },
			{ name: 'Homesnap', imgUrl: 'homesnap.png' },
			{ name: 'UCONN Huskies', imgUrl: 'huskies.png' },
			{ name: 'Mahjong', imgUrl: 'mahjong.png' },
			{ name: 'North Cove Yacht Club', imgUrl: 'ncyc.png' },
			{ name: 'Paw', imgUrl: 'paw.png' },
			{ name: 'Pearce Realty', imgUrl: 'pearce.png' },
			{ name: 'Photos', imgUrl: 'photos.png' },
			{ name: 'Printer', imgUrl: 'printer.png' },
			{ name: 'Router', imgUrl: 'router.png' },
			{ name: 'TS-209', imgUrl: 'ts209.png' },
			{ name: 'Weather', imgUrl: 'weather.png' },
			{ name: 'Google', imgUrl: 'google.png' },
			{ name: 'IMDb', imgUrl: 'imdb.png' },
			{ name: 'New', imgUrl: 'news.png' },
			{ name: 'Wikipedia', imgUrl: 'wikipedia.png' },
            { name: 'Walgreens', imgUrl: 'walgreens.png' },
            { name: 'Google Keep', imgUrl: 'keep.png' }
        ];
    var backgroundImage = '/images/bg.jpg';
    var editImage = '/images/edit.png';

    function readImage(url, callback) {
        function onError() { callback(''); }
        function onXhrGet(status, response) {
            function onReaderLoad(result) { callback(result); }
            if (status == 200) {
                readFile(response, onReaderLoad, onError);
            } else { onError(); }
        }
        getViaXhr(url, 'blob', onXhrGet);
    }

    // Recursive function to process an array of images. Objects in array
    // must contain an 'imgUrl' variable containing the name of the image
    function readImageArray(images, currentIndex, endCallback) {
        if (currentIndex === images.length) {
            endCallback();
        } else {
            let imgUrl = '/images/' + images[currentIndex].imgUrl;
            readImage(imgUrl, function (result) {
                if (result.length) {
                    images[currentIndex].imgUrl = result;
                    readImageArray(images, currentIndex + 1, endCallback);
                } else {
                    images.splice(currentIndex, 1);
                    readImageArray(images, currentIndex, endCallback);
                }
            });
        }
    }

    function getViaXhr(url, responseType, onLoad, onError) {
        var request = new XMLHttpRequest();
        request.responseType = responseType;
        request.open('GET', url, true);
        request.addEventListener("error", onError);
        request.addEventListener("load", function () { onLoad(request.status, request.response) });
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send();
    }

    function readFile(file, onLoad, onError) {
        var reader = new FileReader();
        reader.addEventListener("error", onError);
        reader.addEventListener("load", function () { onLoad(reader.result) });
        reader.readAsDataURL(file);
    }

    function saveAllSettings() {
        chrome.storage.local.set({
            'sites': sites, 'icons': icons, 'backgroundImage': backgroundImage,
            'editImage': editImage, 'showBookmarkNames': 'hover',
            'bookmarkPosition': 'middle'
        }, function () { });
    }

    function saveSetting(setting, callback) {
        chrome.storage.local.set(setting, callback);
    }

    // On fresh install, load default images and settings
    if (details.reason == 'install') {
        // Potentially convoluted series of asychronous calls to load data and save it in chrome storage
        readImageArray(sites, 0, function () { // Load sites
            readImageArray(icons, 0, function () { // Load icons
                readImage(backgroundImage, function (result) { // Load background image
                    backgroundImage = result;
                    readImage(editImage, function (result) { // Load edit image then save settings
                        editImage = result;
                        saveAllSettings();
                    });
                })
            })
        });
    } else if (details.reason === 'update') {
        readImageArray(icons, 0, function () {
            saveSetting({ 'icons': icons }, function() {
                chrome.runtime.openOptionsPage(function() { 
                    alert('MyNewTabPage has been updated. Thank you for your continued support!'); 
                })
            });
        });
    }
});
