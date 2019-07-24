var slider = document.getElementById("slider");
document.getElementById('slide-btn').addEventListener('click', function () {
    slider.style.height = "auto";
    slider.style.opacity = 1;
});

var aliasList = new Object();
var numEntries = 0;

// NOTE:
// - CHECK FOR REPEATED ALIAS ENTRIES
// - STORE AND UPDATE IN CHROME MEMORY
// - ADD HELP PAGE

function addEntry(element) {
    var index = element.parentNode.parentNode.rowIndex;
    var aliases = document.getElementsByClassName("alias-inp");
    var urls = document.getElementsByClassName("url-inp");
    var rows = document.getElementsByTagName("td");
    var actionCell = rows[numEntries * 3 + 2];
    aliasList[aliases[numEntries].value] = urls[numEntries].value;
    actionCell.innerHTML = '<button class="btn btn-light" title="Delete" type="button" onclick="delEntry(this)"><img src="trashcan.svg"></button>';
    numEntries+=1;
    addRow();
}

function delEntry(element) {
    // UPDATE LIST
    var index = element.parentNode.parentNode.rowIndex - 1;
    var aliases = document.getElementsByClassName("alias-inp");
    var urls = document.getElementsByClassName("url-inp");
    aliasList[aliases[index].value] = null;
    numEntries -= 1;
    // UPDATE TABLE
    var parent = element.parentNode.parentNode;
    parent.parentNode.removeChild(parent);
}

function addRow(){
    let row = document.getElementById("entries").insertRow(-1);
    let cell = row.insertCell(-1);
    cell.innerHTML = '<input type="text" class="form-control url-inp">';
    cell = row.insertCell(-1);
    cell.innerHTML = '<input type="text" class="form-control alias-inp">';
    cell = row.insertCell(-1);
    cell.innerHTML = '<button class="btn btn-light" type="button" title="Add Entry" onclick="addEntry(this)"><img src = "check.svg" ></button > ';
}