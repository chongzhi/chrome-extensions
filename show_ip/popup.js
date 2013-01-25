var ip = document.getElementById('ip');
var area = document.getElementById('area');

// 添加监听请求
chrome.webRequest.onCompleted.addListener(function(details) {
    chrome.webRequest.onCompleted.removeListener(arguments.callee);//清除监听
    console.log(details.ip); //请求的ip地址
    var cur_ip = details.ip;
    var str = cur_ip + (cur_ip === '127.0.0.1' ? '<br><span class="color-grey">(有可能使用了本地代理)</span>' : '');
    ip.innerHTML = '当前网站IP：' + str;

    //用新浪API查IP归属地
    var _xhr = new XMLHttpRequest();
    var url = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=' + details.ip;
    _xhr.onreadystatechange = function(xhrEvt) {
        if (_xhr.readyState === 4) {
            var status = _xhr.status.toString(10);
            if (/^2\d{2}$/.test(status) || status === '304') { //2xx及304都通过
                var resp = JSON.parse(_xhr.responseText);
                if (!resp.country) return; //有的IP查不出归属地
                area.innerHTML = '归属地： ' + resp.country + resp.province + resp.city + ' ' + resp.isp;
            }
        }
    };
    _xhr.open('get', url, true);
    // _xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;');
    _xhr.send(null);

}, {"urls": ['*://*/*']}, ['responseHeaders']);

//获取当前tab
chrome.tabs.getSelected(null, function(tab) {
    // 不是合法的http地址
    if (!/^https?:\/\//.test(tab.url)) {
        document.getElementById('ip').innerHTML = '<span style="color:red;">error: 当前不是合法的http地址</span>';
        return;
    }

    // 发一个当前tab的url请求，for ip address
    var xhr = new XMLHttpRequest();
    xhr.open('get', tab.url, true);
    xhr.send(null);
});
