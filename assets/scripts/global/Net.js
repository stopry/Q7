//网络接口
var Net = {
    timeOut:5000,
    //请求地址、请求头、发送数据、成功回调、失败回调
    get:function(url,header,data,succCallBack,errCallBack){//get请求
        //var host = '';
        var host = 'http://api.o2plan.cn';
        //var host = 'http://192.168.19.89:8081';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = JSON.parse(xhr.responseText);
                    //var response = xhr.responseText;
                    succCallBack&&succCallBack(response);
                }else{
                    errCallBack&&errCallBack();
                }
            }
        };
        xhr.open("GET", host+url+(data?this.toUrlPar(data):''), true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        }
        xhr.setRequestHeader("Content-Type","application/json;charset=utf-8");
        if(header){
            xhr.setRequestHeader('Authorization',cc.sys.localStorage.getItem('token'));
        }
        xhr.timeout = this.timeOut;
        xhr.send();
    },

    post:function(url,header,data,succCallBack,errCallBack){//post请求
        //var host = '';
        var host = 'http://api.o2plan.cn';
        //var host = 'http://192.168.19.89:8081';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = JSON.parse(xhr.responseText);
                    succCallBack&&succCallBack(response);
                }else{
                    errCallBack&&errCallBack();
                }
            }
        };
        xhr.open("POST", host+url, true);
        xhr.setRequestHeader("Content-Type","application/json;charset=utf-8");
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        }
        if(header){
            xhr.setRequestHeader('Authorization',cc.sys.localStorage.getItem('token'));
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
    //js对象字面量转化为url请求参数
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

module.exports = Net;