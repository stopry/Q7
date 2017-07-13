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
    close:function(event,type){//关闭
        //type为1为弹窗，2为确认框
        if(type=="1"){
            if(!Global.layer||!Global.layer.name){
                Global.layer = cc.instantiate(this.alertLayer);
            }
            Global.layer.active = false;
        }else if(type=="2"){
            if(!Global.conLayer||!Global.conLayer.name){
                Global.conLayer = cc.instantiate(this.alertLayer);
            }
            Global.conLayer.active = false;
        }else if(type=="3"){
            if(!Global.layerRecharge||!Global.layerRecharge.name){
                Global.layerRecharge = cc.instantiate(this.alertLayer);
            }
            Global.layerRecharge.active = false;
        }
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
