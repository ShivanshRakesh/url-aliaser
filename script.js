var slider = document.getElementById("slider");

document.getElementById("slide-btn").addEventListener("click", function () {
    slider.style.height = "auto";
    slider.style.opacity = 1;
});

var aliasList = new Object();
var numEntries = 0;

document.addEventListener("click", function () {
    document.getElementById("add-entry").addEventListener("click", function (e) {
        var element = this;
        var index = element.parentNode.parentNode.rowIndex;
        var aliases = document.getElementsByClassName("alias-inp");
        var urls = document.getElementsByClassName("url-inp");
        var rows = document.getElementsByTagName("td");
        var actionCell = rows[numEntries * 3 + 2];
        if (aliasList[aliases[numEntries].value] == null || aliasList[aliases[numEntries].value] == undefined) {
            aliasList[aliases[numEntries].value] = urls[numEntries].value;
            actionCell.innerHTML = '<button id="del-entry" class="btn btn-light del-entry" title="Delete" type="button"><img src="trashcan.svg"></button>';
            numEntries += 1;
            chrome.storage.local.set({ entries: aliasList });
            addRow();
        }
        else {
            document.getElementById("heading").innerHTML = "<span style='color: red'>Alias already exists!</span>";
            setTimeout(function(){
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
        chrome.storage.local.set({ entries: aliasList });

        // UPDATE TABLE
        var parent = element.parentNode.parentNode;
        parent.parentNode.removeChild(parent);
    });
});

function addRow() {
    let row = document.getElementById("entries").insertRow(-1);
    let cell = row.insertCell(-1);
    cell.innerHTML = '<input type="text" class="form-control url-inp">';
    cell = row.insertCell(-1);
    cell.innerHTML = '<input type="text" class="form-control alias-inp">';
    cell = row.insertCell(-1);
    cell.innerHTML = '<button id="add-entry" class="btn btn-light" type="button" title="Add Entry"><img src = "check.svg" ></button > ';
}

function disp() {
    chrome.storage.local.get(['entries'], function (result) {
        console.log('Value currently is ' + result.entries);
    });
}