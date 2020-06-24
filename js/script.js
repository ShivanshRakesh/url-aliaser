var slider = document.getElementById("slider");
document.getElementById("slide-btn").addEventListener("click", function () {
    if (slider.style.opacity == 0) {
        slider.style.height = "auto";
        slider.style.opacity = 1;
    }
    else {
        slider.style.height = "0px";
        slider.style.opacity = 0;
    }
});

var releaseNotes = document.getElementById("release-notes");
document.getElementById("release-notes-btn").addEventListener("click", function () {
    if (releaseNotes.style.opacity == 0) {
        releaseNotes.style.height = "auto";
        releaseNotes.style.opacity = 1;
    }
    else {
        releaseNotes.style.height = "0px";
        releaseNotes.style.opacity = 0;
    }
});

var aliasList = new Object();
var numEntries = 0;

$(function () {
    chrome.storage.sync.get('entryList', function (result) {
        if (result.entryList != null && result.entryList != undefined) {
            for (key in result.entryList) {
                if (result.entryList[key] != null && result.entryList[key] != undefined) {
                    addRow(key, result.entryList[key], true);
                    aliasList[key] = result.entryList[key];
                }
            }
        }
        addRow();
    });

    chrome.storage.sync.get('numEntries', function (result) {
        if (result.numEntries)
            numEntries = result.numEntries;
    });
});

document.addEventListener("click", function () {
    document.getElementById("add-entry").addEventListener("click", function (e) {
        var aliases = document.getElementsByClassName("alias-inp");
        var urls = document.getElementsByClassName("url-inp");
        var rows = document.getElementsByTagName("td");
        var actionCell = rows[numEntries * 3 + 2];
        if (aliasList[aliases[numEntries].value] == null || aliasList[aliases[numEntries].value] == undefined) {
            var prefix = String(urls[numEntries].value).split('://');
            var url = (prefix.length == 1) ? ["http://", urls[numEntries].value].join('') : urls[numEntries].value.toString();
            aliasList[aliases[numEntries].value.toLowerCase()] = url.toLowerCase();
            aliases[numEntries].setAttribute("readonly", "true");
            aliases[numEntries].value = aliases[numEntries].value.toLowerCase();
            urls[numEntries].setAttribute("readonly", "true");
            urls[numEntries].value = urls[numEntries].value.toLowerCase();
            actionCell.innerHTML = '<button id="del-entry" class="btn btn-light del-entry" title="Delete" type="button"><img src="images/trashcan.svg"></button>';
            numEntries += 1;
            chrome.storage.sync.set({ 'entryList': aliasList });
            chrome.storage.sync.set({ 'numEntries': numEntries });
            addRow();
        }
        else {
            document.getElementById("heading").innerHTML = "<span style='color: red'>Alias already exists!</span>";
            setTimeout(function () {
                document.getElementById("heading").innerHTML = "<span style='color: black'>Aliases</span>";
            }, 4000);
        }
    });

    $('.del-entry').click(function (e) {
        var element = this;
        var index = element.parentNode.parentNode.rowIndex - 1;
        var aliases = document.getElementsByClassName("alias-inp");
        var urls = document.getElementsByClassName("url-inp");
        aliasList[aliases[index].value] = null;
        numEntries -= 1;
        chrome.storage.sync.set({ 'entryList': aliasList });
        chrome.storage.sync.set({ 'numEntries': numEntries });

        // UPDATE TABLE
        var parent = element.parentNode.parentNode;
        parent.parentNode.removeChild(parent);
    });
});

function addRow(key = "", url = "", readonly = false) {
    let row = document.getElementById("entries").insertRow(-1);
    let cell = row.insertCell(-1);
    if (readonly) {
        cell.innerHTML = '<input type="text" class="form-control url-inp" readonly value = "' + url + '">';
        cell = row.insertCell(-1);
        cell.innerHTML = '<input type="text" class="form-control alias-inp" readonly value ="' + key + '">';
        cell = row.insertCell(-1);
    }
    else {
        cell.innerHTML = '<input type="text" class="form-control url-inp" value = "' + url + '">';
        cell = row.insertCell(-1);
        cell.innerHTML = '<input type="text" class="form-control alias-inp" value ="' + key + '">';
        cell = row.insertCell(-1);
    }
    if (key == "")
        cell.innerHTML = '<button id="add-entry" class="btn btn-light" type="button" title="Add Entry"><img src = "images/check.svg" ></button>';
    else
        cell.innerHTML = '<button id="del-entry" class="btn btn-light del-entry" title="Delete" type="button"><img src="images/trashcan.svg"></button>';
}

function disp() {
    chrome.storage.sync.get(['entryList'], function (result) {
        for (key in result.entryList) {
            console.log('Value currently is ' + key + ":" + result.entryList[key]);
        }
    });
}
