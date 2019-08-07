chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        var placeholderCnt = 0;

        // FETCH NEW URL
        var url_with_https = changeInfo.url;
        var url_obj = /^http[s]?:\/\/(.+)/.exec(url_with_https);

        if (url_obj) {

            // DIVIDE THE URL INTO PARTS TO CHECK FOR ANY PLACEHOLDERS
            var url_divs = url_obj[1].split('\/');
            if (url_divs != null && url_divs.length > 1) {
                let alias = url_divs[0];
                var divIndx = 1;

                // GET ALIAS ENTRIES FROM CHROME STORAGE
                chrome.storage.sync.get('entryList', function (result) {

                    // PROCEED IF AN ALIAS MATCHES THE FIRST DIVISION OF THE URL
                    if (result.entryList[alias] != null && result.entryList[alias] != undefined) {
                        let urlToRedir = '';

                        // GET THE URL REGISTERED WITH THE ALIAS
                        url_stored = result.entryList[alias];

                        // SPLIT THE REGISTERED URL TO CHECK FOR ANY PLACEHOLDERS (%%)
                        var splits = url_stored.split('/');
                        for (i = 0; i < splits.length; i++) {
                            var toJoin = '';

                            // IF THE PART IS A PLACEHOLDER, REPLACE IT WITH RESPECTIVE DIVISION OF URL ENTERED
                            if (splits[i] == "%%") {
                                placeholderCnt++;
                                if (divIndx < url_divs.length)
                                    toJoin = url_divs[divIndx++];
                            }
                            else
                                toJoin = splits[i];
                            urlToRedir = [urlToRedir, '/', toJoin].join('');
                        }

                        // IF NUMBER OF PLACEHOLDER IS NOT EQUAL TO ARGUMENTS PASSED, RAISE AN ERROR
                        // ELSE, REDIRECT TO GENERATED URL
                        if (placeholderCnt < url_divs.length - 2) {
                            alert("Number of arguments passed exceeds number of placeholders registered!");
                        }
                        else if (placeholderCnt > url_divs.length - 2) {
                            alert("Number of placeholders registered exceeds number of arguments passed!");
                        }
                        else {
                            chrome.tabs.update(tabId, { url: urlToRedir });
                            console.log("Redirecting to: " + urlToRedir);
                        }
                    }
                });
            }
        }
    }
);

// NOTIFY ON UPDATE
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "update") {
        alert("URL Aliaser got updated to latest version!");
    }
});