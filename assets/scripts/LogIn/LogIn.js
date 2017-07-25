var util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        userName:{// 用户名
            default:null,
            type:cc.EditBox
        },
        password:{// 密码
            default:null,
            type:cc.EditBox
        },
        verCode:{//图形验证码输入框
            default:null,
            type:cc.EditBox
        },
        verImg:{//验证码图片node
            default:null,
            type:cc.Node
        },
        codeImg:{//图片验证码sprite
            default:null,
            type:cc.Sprite
        },
        remPwd:{//  记住密码
            default:null,
            type:cc.Node
        },
        littleTip:{
            default:null,
            type:cc.Prefab
        },
        root: {
            default: null,
            type: cc.Node
        },
        persistNode:{//常驻节点
            default:null,
            type:cc.Node
        },
        reqAni:{//网络请求加载遮罩层
            default:null,
            type:cc.Node
        }
    },
    // use this for initialization
    onLoad: function () {
        cc.director.setDisplayStats(false);
        //添加常驻节点
        cc.game.addPersistRootNode(this.persistNode);//场景切换数据传递
        cc.game.addPersistRootNode(this.reqAni);//网络请求加载遮罩层
        this.autoInput();
        this.changeVer(); 
    },
    logIn:function(){
        // 登录
        var account = (this.userName.string).trim();//账号
        var password = (this.password.string).trim();//密码
        var verCode = (this.verCode.string).trim();//图形验证码

        // 记住密码
        var isRemPwd = this.remPwd.children[1].active;
        if(!util.regMobile(account)){
            this.showLittleTip("请填写正确手机号");
            return;
        }else if(!password){
            this.showLittleTip("请填写密码");
            return;
        }else if(!verCode){
            this.showLittleTip("请填写验证码")
            return;
        }

        if(isRemPwd){
            this.remActPwd(account,password);
        }else{
            this.removeStorage();
        }

        this.getComponent('ReqAni').showReqAni();
        this.showLittleTip("登录成功");

        //cc.log()
        if(!account) account = '无名';
        var userData = {
            nickname:account,
            level:14,
            jewel:500,
            gold:400
        };
        if(!this.persistNode.name){
            this.persistNode = cc.director.getScene().getChildByName('PersistNode');
        }
        this.persistNode.getComponent('PersistNode').userData.headerInfo = userData;
        this.scheduleOnce(function() {//延迟0.5s执行
            this.getComponent('ReqAni').hideReqAni();
            cc.director.loadScene("CreatRole",function(){//回调

            }.bind(this));
        }, 0.5);
    },
    autoInput(){//记住密码状态下自动填充账号密码
        if(cc.sys.localStorage.getItem('act')&&cc.sys.localStorage.getItem('pwd')){
            this.userName.string = cc.sys.localStorage.getItem('act');
            this.password.string = cc.sys.localStorage.getItem('pwd');
        }else{
            this.userName.string = '';
            this.password.string = '';
        }
    },
    remActPwd(act,pwd){//记住账号密码
        cc.sys.localStorage.setItem('act', act);
        cc.sys.localStorage.setItem('pwd', pwd);
    },
    removeStorage(){//删除本地数据
        cc.sys.localStorage.removeItem('act');
        cc.sys.localStorage.removeItem('pwd');
    },
    changeVer(){//切换验证码
        var self = this;
        this.verImg.on(cc.Node.EventType.TOUCH_END,function(event){
            //var remoteUrl = "http://image.lxway.com/upload/f/1a/f1a43af2f1affea07407bbae75f24208_thumb.gif";//跨域报错
            //cc.loader.load(remoteUrl, function (err, texture) {
            //    cc.log(texture)
            //});

            cc.loader.loadRes("/images/waterMalen", cc.SpriteFrame, function (err, spriteFrame) {//本地图片测试
                self.codeImg.spriteFrame = spriteFrame;
            });

        },this);
    },
    regist:function(){
        //this.showLittleTip("暂未设计");
    },
    update: function (dt) {

    },
    //setInputControl(){//设置事件监听
    //    var self = this;
    //    var listener = {
    //        event:cc.EventListener.TOUCH_ONE_BY_ONE,
    //        onTouchBegan:function(touches,event){
    //            alert(1);
    //        },
    //        onTouchMoved:function(touches,event){
    //
    //        },
    //        onTouchEnded:function(touches,event){
    //
    //        }
    //    }
    //    cc.eventManager.addListener(listener,self.verImg.node);
    //},
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    }
});
