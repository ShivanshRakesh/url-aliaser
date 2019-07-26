chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        var url_with_https = changeInfo.url;
        var url_obj = /^http[s]?:\/\/(.+)/.exec(url_with_https);
        if (url_obj) {
            var alias = url_obj[1].split('\/');
            if (alias != null && alias.length > 1) {
                // console.log(alias[0]);
                chrome.storage.local.get('entryList', function (result) {
                    if (result.entryList[alias[0]] != null && result.entryList[alias[0]] != undefined)
                        chrome.tabs.update(tabId, { url: result.entryList[alias[0]] });
                });
            }
        }
    }
);