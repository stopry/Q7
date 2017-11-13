var util = require('Util');//导入工具库
var Net = require('Net');
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
        bgPic:{
            default:[],
            type:[cc.SpriteFrame]
        },
        itemBorder:{
            default:null,//被选充值金额边框
            type:cc.Node
        },
        myMoney:{
            default:null,
            type:cc.Label
        },
        exchangeJewel:{//兑换类型
            default:20000,
            type:cc.Integer
        },//兑换类型
        needMoney:{//需要的金币
            default:200,
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
                //var pos = item.getPosition();
                //var action = cc.moveTo(0.08,pos);
                //self.itemBorder.runAction(action);
                this.item[0].getComponent(cc.Sprite).spriteFrame = this.bgPic[0];
                this.item[1].getComponent(cc.Sprite).spriteFrame = this.bgPic[0];
                this.item[2].getComponent(cc.Sprite).spriteFrame = this.bgPic[0];
                item.getComponent(cc.Sprite).spriteFrame = this.bgPic[1];
                self.exchangeJewel = parseInt(util.splitStr(item.jewel));
                self.needMoney = parseInt(util.splitStr(item.money));
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
        dia.getComponent('ConfirmDia').setBoxFun('确定要用'+this.needMoney+'金币兑换'+this.exchangeJewel+'砖石吗？',function(){
            //cc.log('ok');
            this.confirmExh();
        }.bind(this),function(){
            //cc.log('no');
        });
        dia.getComponent('ConfirmDia').showThis();
    },
    //去交易界面充值
    toRecharge(){
        let token = cc.sys.localStorage.getItem('token');
        token = encodeURI(token);
        cc.sys.openURL("http://wap.market.o2plan.cn/#/skipPage?token="+token+"&link=goldRecharge");
        // cc.sys.openURL("http://localhost:4200/#/skipPage?token="+token+"&link=goldRecharge");

    },
    confirmExh(){//确认兑换钻石
        var self = this;
        Net.get('/api/game/jewel/convert',1,{num:self.exchangeJewel},function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
                return
            }
            this.showLittleTip('兑换成功');
            cc.find('Game').getComponent('UpdateUserInfo').refresh(1);//更新界面信息
            this.intRecharge();//更新砖石框
        }.bind(this),function(err){

        }.bind(this));
    },
    intRecharge(){//渲染钻石框
        Net.get('/api/game/jewel/list',1,null,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
                return;
            }
            this.myMoney.string = data.obj.money;
            for(var i = 0;i<data.obj.list.length;i++){
                this.item[i].getChildByName('jewel').getComponent(cc.Label).string = data.obj.list[i].jewel;
                this.item[i].getChildByName('money').getComponent(cc.Label).string = data.obj.list[i].money;
                this.item[i].jewel = 'gold_'+ data.obj.list[i].jewel;
                this.item[i].money = 'gold_'+ data.obj.list[i].money;
            }
            this.exchangeJewel = data.obj.list[0].jewel;//默认兑换砖石数量
            this.needMoney = data.obj.list[0].money;//默认兑换砖石数量
            this.item[0].getComponent(cc.Sprite).spriteFrame = this.bgPic[1];
            this.item[1].getComponent(cc.Sprite).spriteFrame = this.bgPic[0];
            this.item[2].getComponent(cc.Sprite).spriteFrame = this.bgPic[0];
        }.bind(this), function (err) {

        }.bind(this));
    },
    showThis(){//显示动画
        this.recharge.active = true;
        this.recharge.runAction(Global.openAction);
        this.intRecharge();
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
