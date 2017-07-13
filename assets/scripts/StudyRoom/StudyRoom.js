cc.Class({
    extends: cc.Component,

    properties: {
        //确认框资源start
        conDia:{//确认对话框
            default:null,
            type:cc.Prefab
        },
        root:{//根节点
            default:null,
            type:cc.Node
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        //确认框资源end
        littleTip:{//小提示
            default:null,
            type:cc.Prefab
        },
        studyRoom:{//科研所框
            default:null,
            type:cc.Node
        },
        upBtn:{//升级按钮
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.upBtn.on(cc.Node.EventType.TOUCH_END,function(){
            this.showConDia('确认升级种植大全吗!',function(){
                this.showLittleTip('升级成功')
            }.bind(this),function(){
                this.showLittleTip('取消升级')
            }.bind(this));
        },this)
    },
    showThis(){//显示动画
        this.studyRoom.active = true;
        this.studyRoom.runAction(Global.openAction);
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    showConDia(msg,fn1,fn2){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = this.root;
        Global.conLayer.active = true;

        var dia = cc.instantiate(this.conDia);
        dia.parent = this.root;
        dia.getComponent('ConfirmDia').setBoxFun(msg,fn1,fn2);
        dia.getComponent('ConfirmDia').showThis();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
