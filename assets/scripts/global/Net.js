//网络接口
var Net = {
    timeOut:5000,
    //请求地址、请求头、发送数据、成功回调、失败回调
    get:function(url,header,data,succCallBack,errCallBack){//get请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                succCallBack&&succCallBack(response);
            }else{
                errCallBack&&errCallBack();
            }
        };
        xhr.open("GET", url+this.toUrlPar(data), true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        }
        xhr.timeout = this.timeOut;
        xhr.send();
    },

    post:function(url,header,data,callBack,errCallBack){//post请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                succCallBack&&succCallBack(response);
            }else{
                errCallBack&&errCallBack();
            }
        };
        xhr.open("POST", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        }
        xhr.timeout = this.timeOut;
        xhr.send(JSON.stringify(data));
    },

    ws:function(url,openCallBack,messageCallBack,errCallBack,closeCallBack){//WebSocket
        ws = new WebSocket(url);
        ws.onopen = function (event) {
            openCallBack&&openCallBack(event);
        };
        ws.onmessage = function (event) {
            messageCallBack&&messageCallBack(event);
        };
        ws.onerror = function (event) {
            errCallBack&&errCallBack(event);
        };
        ws.onclose = function (event) {
            closeCallBack&&closeCallBack(event);
        };
        //setTimeout(function () {//发送数据
        //    if (ws.readyState === WebSocket.OPEN) {
        //        ws.send("Hello WebSocket, I'm a text message.");
        //    }
        //    else {
        //        console.log("WebSocket instance wasn't ready...");
        //    }
        //}, 3);
    },
    toUrlPar:function(obj) {
        var s = ""
        for (var itm in obj) {
            if (obj[itm] instanceof Array == true) {
                //是数组
                s += "&" + itm + "_count=" + obj[itm].length
                for (var i = 0; i < obj[itm].length; i++) {
                    if (obj[itm][i] instanceof Array == true) {
                        s += ergodicJson2(obj[itm][i]);
                    } else if (obj[itm][i] instanceof Object == true) {
                        s += ergodicJson2(obj[itm][i]);
                    } else {
                        s += "&" + encodeURI(obj[itm][i]) + "=" + encodeURI(obj[itm][i]);
                    }
                }
            } else if (obj[itm] instanceof Object == true) {
                //是json对象。
                s += ergodicJson2(obj[itm]);
            }
            else {
                //是简单数值
                s += "&" + encodeURI(itm) + "=" + encodeURI(obj[itm]);
            }
        }
        if(s){
            s = "?"+s.substring(1,s.length);
            return s;
        }else{
            return '';
        }

    },
};

module.exports = {
  Net:Net
};