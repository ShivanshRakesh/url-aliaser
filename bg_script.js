chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        var placeholderCnt = 0;
        var url_with_https = changeInfo.url;
        var url_obj = /^http[s]?:\/\/(.+)/.exec(url_with_https);
        if (url_obj) {
            var url_divs = url_obj[1].split('\/');
            if (url_divs != null && url_divs.length > 1) {
                let alias = url_divs[0];
                var divIndx = 1;
                chrome.storage.local.get('entryList', function (result) {
                    if (result.entryList[alias] != null && result.entryList[alias] != undefined) {
                        let urlToRedir = '';
                        url_stored = result.entryList[alias];
                        var splits = url_stored.split('/');
                        for (i = 0; i < splits.length; i++) {
                            var toJoin = '';
                            if (splits[i] == "%%") {
                                placeholderCnt++;
                                if (divIndx < url_divs.length)
                                    toJoin = url_divs[divIndx++];
                            }
                            else
                                toJoin = splits[i];
                            urlToRedir = [urlToRedir, '/', toJoin].join('');
                        }

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