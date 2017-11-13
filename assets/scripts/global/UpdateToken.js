//定时更新token

var Net = require('Net');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.interValToken = null;
    },
    //每十分钟更新一次token
    updateToken(){

        var act = cc.sys.localStorage.getItem('act');
        var pwd = cc.sys.localStorage.getItem('pwd');

        if(!act||!pwd){
            return;
        }

        var logdata =  {
            "captchaCode": "",
            "captchaValue": "",
            "clientId": "098f6bcd4621d373cade4e832627b4f6",
            "login_channel": "",
            "password": pwd,
            "userName": act
        };
        this.interValToken = setInterval(()=>{
            console.log('定时更新token');
            Net.post('/market/oauth/token',!1,logdata,(data)=>{
                if(data.success){
                    cc.sys.localStorage.setItem('token',data.obj.tokenType+" "+data.obj.accessToken);
                }
            });

        },1000*60*10)
    },

    //停止更新token
    stopUpdateToken(){
        clearInterval(this.interValToken);
        console.log('停止更新token')
        // if(this.interValToken){
        //     clearInterval(this.interValToken);
        //     console.log('停止更新token')
        // }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
