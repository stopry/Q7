cc.Class({
    extends: cc.Component,

    properties: {
        backLogin:{
            default:null,
            type:cc.Node
        },
        userPic:{//用户头像
            default:null,
            type:cc.Sprite
        },
        headerInfo:[cc.Label],//头部信息
        spriteList: {//用户图片列表
            default: [],
            type: [cc.SpriteFrame]
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.director.setDisplayStats(false);
        this.backLogin.on('touchstart',function(event){
            this.back();
        },this);
        //this.setHeader();

    },
    setHeader(){//设置头部
        var perNode = cc.director.getScene().getChildByName('PersistNode');
        if(perNode.getComponent('PersistNode').userData.nickName){
            this.headerInfo[0].string = perNode.getComponent('PersistNode').userData.nickName;
            this.userPic.spriteFrame = this.spriteList[perNode.getComponent('PersistNode').userData.userPic-1];
        };
    },
    back:function(){
        if(Global.layer){
            Global.layer = null;
        }
        cc.director.loadScene("LogIn");
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
