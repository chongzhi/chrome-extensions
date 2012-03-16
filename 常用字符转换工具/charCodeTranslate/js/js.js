function G(id) {
    return id ? document.getElementById(id) : null;
}


/**
 * excute
 */ 
var input     = G('input'),
    convert   = G('convert'),
    CSSResult = G('resultCSSType'),
    JSResult  = G('resultJSType'),
    msg       = G('msg'),
    sel       = G('changeType'),
    cssType   = G('cssType');

/**
 * 字符转unicode
 * @param  {string} v 传入的结果字符值
 * @return {string}
 */
function unicodeToString(v) {
    var resultArr = [];
    //检测英文等字符排除
    /* function checkInput(str) {
        var charReg = /[^\u0391-\uFFE5]/g; //匹配英文等字符
        
        if (charReg.test(str)) {
            msg.innerHTML = '输入字符格式有误，请输入中文等字符';
            input.select();
            input.focus();
            renderResult('');
            return false;
        } else {
            msg.innerHTML = '';
            return true;
        }
        
    } */

    function toUnicode(str, cssType) {
        var i = 0, 
            l = str.length,
            result = [], //转换后的结果数组
            unicodePrefix, //unicode前缀 (example:\1234||\u1234)
            unicode16; //转换成16进制后的unicode
        
        //如果是css中使用格式为\1234之类  
        unicodePrefix = (cssType && cssType.toLowerCase() === 'css') ? '\\' : '\\u';
            
        for (; i < l; i++) {
            //转为16进制的unicode, js及css里须转成16进制
            unicode16 = str.charCodeAt(i).toString(16); 
            result[i] = unicodePrefix + new Array(5 - unicode16.length).join('0') + unicode16;
        }
        
        return result.join('');
    }

    resultArr.push(toUnicode(v));
    resultArr.push(toUnicode(v, 'css'));
    
    return resultArr;
    
} 

/**
 * unicode转字符
 * @param  {string} v 转unicode
 * @return {string}
 */
function stringToUnicode(v) {
    var arrs, i, len, arr, result = '';
    
    
    if (/\\u/.test(v)) {
        arrs = v.split('\\u');
    } else {
        arrs = v.split('\\');
    }
    
    arrs.shift();
    
    for (i = 0, len = arrs.length; i < len; i++) {
        arrs[i] = parseInt(arrs[i], 16);
    }
    
    result = String.fromCharCode.apply(null, arrs);

    return result;
    
}

/**
 * encode decode字符串
 * @param  {string} v    传入的字符串
 * @param  {string} flag encode还是decode
 * @return {string}
 */
function encodeStr(v, flag) {
    return encodeURIComponent(v);
}

function decodeStr (v) {
    return decodeURIComponent(v);
}

/**
 * DecimalHTML
 * @param {string} v 传入的字符串
 * @return {string} 处理的结果
 */
function DecimalHTML (v) {
    var i = v.length,
        result = [];

    while (i--) {
        result.unshift('&#' + v.charCodeAt(i) + ';');
    }

    return result.join('');
}
    


/**
 * converType
 * @param  {[type]} e [description]
 * @return {[type]}
 */
function converType(e) {
    var val = sel.value,
        v = input.value,
        result = '';
        
    if (v === '') return;
    
    //管理事件
    if (e.type === 'click') {
        conType();
    } else if (e.type === 'keydown') {
        if (e.keyCode === 13) { 
            conType();
        }
    }

    function conType() {
        switch (val) {
            case '1': 
                result = unicodeToString(v);
                renderResultCssType(result);
                break;
                
            case '2': 
                result = stringToUnicode(v);
                renderResult(result);
                break;
                
            case '3': 
                result = encodeStr(v);
                renderResult(result);
                break;
                
            case '4': 
                result = decodeStr(v);
                renderResult(result);
                break;

            case '5': 
                result = DecimalHTML(v);
                renderResult(result);
                break;
        }
    }
    
    
  
}

/**
 * 渲染结果
 * @param  {string} v 结果字符串
 * @return {undefined}
 */
function renderResult (v) {
    JSResult.value = v;
    cssType.style.display = "none";  
}

function renderResultCssType (v) {
    JSResult.value = v[0];
    CSSResult.value = v[1];
    cssType.style.display = "block";
}

function focusToSelect() {
    this.select();
}

   
//bind事件
convert.addEventListener('click', converType, false);
input.addEventListener('keydown', converType, false);
CSSResult.addEventListener('click', focusToSelect, false);
JSResult.addEventListener('click', focusToSelect, false);