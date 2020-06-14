chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        var placeholderCnt = 0;

        // FETCH NEW URL
        var url_with_https = tab.url;
        var url_obj = /^http[s]?:\/\/(.+)/.exec(url_with_https);

        if (url_obj) {

            // DIVIDE THE URL INTO PARTS TO CHECK FOR ANY PLACEHOLDERS
            var url_divs = url_obj[1].split('\/');
            if (url_divs != null && url_divs.length > 1) {
                let alias = url_divs[0];
                var divIndx = 1;

                // GET ALIAS ENTRIES FROM CHROME STORAGE
                chrome.storage.sync.get('entryList', function(result) {

                    // PROCEED IF AN ALIAS MATCHES THE FIRST DIVISION OF THE URL
                    if (result.entryList[alias] != null && result.entryList[alias] != undefined) {
                        let urlToRedir = '';
                        // GET THE URL REGISTERED WITH THE ALIAS
                        url_stored = String(result.entryList[alias]).split('://')[1];

                        // SPLIT THE REGISTERED URL TO CHECK FOR ANY PLACEHOLDERS (%%)
                        // IF THE PART IS A PLACEHOLDER, REPLACE IT WITH RESPECTIVE DIVISION OF URL ENTERED
                        if (url_stored.includes('%%')) {
                            var splits = url_stored.split('%%');
                            placeholderCnt = splits.length - 1;
                            for (i = 0; i < splits.length; i++) {
                                var toJoin = '';
                                if (divIndx < url_divs.length)
                                    toJoin = [splits[i], url_divs[divIndx++]].join('');
                                else
                                    toJoin = splits[i];
                                urlToRedir = [urlToRedir, toJoin].join('');
                            }
                        } else {
                            urlToRedir = url_stored;
                        }


                        // IF NUMBER OF PLACEHOLDER IS NOT EQUAL TO ARGUMENTS PASSED, RAISE AN ERROR
                        // ELSE, REDIRECT TO GENERATED URL
                        if (placeholderCnt < url_divs.length - 2) {
                            alert("Number of arguments passed exceeds number of placeholders registered!");
                        } else if (placeholderCnt > url_divs.length - 2) {
                            alert("Number of placeholders registered exceeds number of arguments passed!");
                        } else {
                            urlToRedir = [String(result.entryList[alias]).split('://')[0], '://', urlToRedir].join('');
                            console.log("Redirecting to: " + urlToRedir);
                            chrome.tabs.update(tabId, { url: urlToRedir });
                        }
                    }
                });
            }
        }
    }
);

// NOTIFY ON UPDATE
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "update") {
        let message = `Hurray! URL Aliaser got updated to version ${chrome.runtime.getManifest().version}!`;
        var options = {
            type: 'basic',
            title: "URL Aliaser got updated!",
            message: message,
            iconUrl: 'images/icon.png'
        };
        chrome.notifications.create(options);
    }
});