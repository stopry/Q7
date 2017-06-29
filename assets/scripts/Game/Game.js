cc.Class({
    extends: cc.Component,

    properties: {
        backLogin:{
            default:null,
            type:cc.Node
        },
        headerInfo:{
            default:null,
            type:cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        this.backLogin.on('touchstart',function(event){
            this.back();
        },this);
        var xigua = cc.director.getScene().getChildByName('PersistNode');
        if(xigua){
            this.headerInfo.string = JSON.stringify(xigua.getComponent('PersistNode').userData);
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
