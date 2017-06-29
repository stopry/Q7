//打开弹出窗口
cc.Class({
    extends: cc.Component,

    properties: {
        alertBox:{//弹出框
            default:null,
            type:cc.Prefab
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        root:{//根节点
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {

    },
    open:function(){//打开弹窗
        if(!Global.layer){
            Global.layer = cc.instantiate(this.alertLayer);
            Global.layer.parent = this.root;
        }
        Global.layer.active = true;
        var _alertBox = cc.instantiate(this.alertBox);
        _alertBox.parent = this.root;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
