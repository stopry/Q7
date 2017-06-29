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
        this.alertBox.active = false;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
