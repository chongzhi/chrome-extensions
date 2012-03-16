var sbBtn = document.querySelector('#subLink');
var autoSubmit = document.createElement('span');
var n;
autoSubmit.innerHTML = '自动登录';
autoSubmit.className = 'autoLogin';


function G(id) {
    return document.getElementById(id);
}

//ajax异步请求
function _ajax( settings ){
    
	//发送http请求
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if( xhr.readyState === 4 ){
			if( ( xhr.status >= 200 && xhr.status < 300 ) ||
				xhr.status === 304 ||
				xhr.status === 1223 ){
				var response = xhr.responseText ; //数据解码
				if( settings.success ){
					settings.success( response );
				}
			}
		}
	}
	xhr.open( settings.type, settings.url, true );
    
    
    xhr.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
    xhr.setRequestHeader('Cache-Control', 'max-age=0');
    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
    
	if( settings.type.toLowerCase() === "get" ){
		xhr.send( null );
	}else if( settings.type.toLowerCase() === "post" ){
		xhr.send( settings.data );
	}
};



if (sbBtn) {
    sbBtn.parentNode.insertBefore(autoSubmit, sbBtn.nextSibling);

    autoSubmit.addEventListener('click', function () {
        var user = G('UserName').value;
        var psd = G('password').value;
        var ranCode = G('randCode').value;
        n = 0;
        
        ajaxLogin(user, psd, ranCode);
        
    });
}







function ajaxLogin(user, psd, ranCode) {
    
    $.ajax({
        url: 'https://dynamic.12306.cn/otsweb/loginAction.do?method=login',
        type: 'POST',
        data: 'loginUser.user_name='+ user +'&user.password='+ psd +'&randCode='+ ranCode,
        success: function (msg) {
            if ( msg.indexOf('请输入正确的验证码') > -1 ) {
                alert('请输入正确的验证码！');
            } else if ( msg.indexOf('当前访问用户过多') > -1 ){
                n++;
                autoSubmit.innerHTML = '第'+ n +'次登录';
                setTimeout(function () {
                    ajaxLogin(user, psd, ranCode);
                }, 500);
            } else if( msg.match(/var\s+isLogin\s*=\s*true/i) ) {
                flag = false;
                alert('登录成功');
                window.location.href = '/otsweb/order/querySingleAction.do?method=init';
                //notify('登录成功，开始查询车票吧！');
                //window.location.replace( queryurl );
            } else {
                msg = msg.match(/var\s+message\s*=\s*"([^"]*)/);
                if( msg && msg[1] ) {
                    alert( msg && msg[1] );
                } else {
                    n++;
                    autoSubmit.innerHTML = '第'+ n +'次登录';
                    setTimeout(function () {
                        ajaxLogin(user, psd, ranCode);
                    }, 500);
                }
            }
            
        }
    });
}




