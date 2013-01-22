// 添加监听请求
chrome.webRequest.onCompleted.addListener(function(details) {
    console.log(details.ip); //请求的ip地址
    document.getElementById('ip').innerHTML = '当前网站IP：' + details.ip;
}, {"urls": ['*://*/*']}, ['responseHeaders']);

//获取当前tab
chrome.tabs.getSelected(null, function(tab) {
    // 不是合法的http地址
    if (!/^https?:\/\//.test(tab.url)) {
        document.getElementById('ip').innerHTML = '<span style="color:red;">error: 当前不是合法的http地址</span>';
        return;
    }

    // 发一个当前tab的url请求
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (xhrEvt) {
        var x = xhr;
    };
    xhr.open('get', tab.url, false);
    xhr.send(null);
});
