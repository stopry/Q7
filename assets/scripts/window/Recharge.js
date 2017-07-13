var util = require('Util');//导入工具库
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

        recharge:{//充值框
            default:null,
            type:cc.Node
        },
        item:[cc.Node],
        itemBorder:{
            default:null,//被选充值金额边框
            type:cc.Node
        },
        exchangeType:{//兑换类型
            default:1,
            type:cc.Integer
        },//兑换类型
        exchangeBtn:{//兑换按钮
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.selMoney();
    },
    selMoney(){//选择金额框
        var self = this;
        ;[].forEach.call(self.item,function(item){
            item.on(cc.Node.EventType.TOUCH_END,function(event){
                var pos = item.getPosition();
                var action = cc.moveTo(0.08,pos);
                self.itemBorder.runAction(action);
                self.exchangeType = parseInt(util.splitStr(item.name));
            },self);
        });
    },
    exchange(){//兑换
        this.showConDia();
    },
    showConDia(){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = this.root;
        Global.conLayer.active = true;

        var dia = cc.instantiate(this.conDia);
        dia.parent = this.root;
        dia.getComponent('ConfirmDia').setBoxFun(this.exchangeType,function(){
            cc.log('ok');
            this.showLittleTip('兑换成功');
        }.bind(this),function(){
            cc.log('no');
        });
        dia.getComponent('ConfirmDia').showThis();
    },
    showThis(){//显示动画
        this.recharge.active = true;
        this.recharge.runAction(Global.openAction);
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
