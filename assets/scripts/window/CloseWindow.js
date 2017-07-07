//关闭弹框
cc.Class({
    extends: cc.Component,

    properties: {
        alertBox:{//
            default:null,
            type:cc.Node
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {

    },
    close:function(){//关闭
        if(!Global.layer){
            Global.layer = cc.instantiate(this.alertLayer);
        }
        Global.layer.active = false;

        var scaleTo = cc.scaleTo(0.1,1.1,1.1);
        var scaleTo2 = cc.scaleTo(0.1,0,0);
        var fadeOut = cc.fadeTo(0.1,0);
        var finished = cc.callFunc(function () {
            this.alertBox.active = false;
        }, this);
        var action = cc.sequence(scaleTo,scaleTo2, finished);
        this.alertBox.runAction(action);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
