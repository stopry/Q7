var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        enterpot:{//仓库
            default:null,
            type:cc.Node
        },
        itemTemplate:{//仓库列表项
            default:null,
            type:cc.Prefab
        },
        content:{//列表容器数组
            default:[],
            type:[cc.Node]
        },
        button:{//列表对应按钮数组
            default:[],
            type:[cc.Node]
        },
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
    },
    // use this for initialization
    onLoad: function () {
        this.createEntItemPool();
        this.items = [];
    },
    createEntItemPool(){//仓库item对象池
        this.itemPool = [[],[],[],[]];
    },
    initialize:function(type){//0123——树苗-道具-木材-碳汇
        this.type = type;//仓库类型
        cc.log(this.type);
        var itemLen = this.content[this.type].getChildren().length;//子节点数量
        for(var l = 0;l<itemLen;l++){
            (this.itemPool[this.type]).push(this.content[this.type].getChildren()[l]);
        }
        this.content[this.type].removeAllChildren();//移除所有子节点
        this.getEnterData(type);

    },
    getEnterData(type){//得到仓库信息
        var type = type+1||1;
        Net.get('/api/game/getPlayerItemList',1,{type:type},function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else if(data.obj.length<=0){
                this.showLittleTip('没有物品信息');
            }else{
                var _len = data.obj.length;
                var item = null;
                for(var i = 0;i<_len;i++){
                    if((this.itemPool[this.type]).length>0){
                        item = (this.itemPool[this.type]).shift();
                    }else{
                        item = cc.instantiate(this.itemTemplate);
                    }
                    cc.log('ccc');
                    this.content[type-1].addChild(item);
                    item.getComponent('SetEnterpotItem').setItme(
                        parseInt(((data.obj[i].itemTypeId).toString()).split('')[3])-1,//物品图片
                        data.obj[i].cnt,//物品数量
                        data.obj[i].name,//物品名字
                        data.obj[i].desc//物品描述
                    );
                    //this.items.push(item);
                }
            }
        }.bind(this),function(err){

        }.bind(this))

    },
    changeBox(event,customEventData){//切换列表容器
        var index = parseInt(customEventData)||0;
        if(this.type==index){//不是切换不做任何请求
            return;
        };
        for(let i = 0;i<this.content.length;i++){
            this.content[i].active = false;
        }
        this.content[index].active = true;
        this.content[index].removeAllChildren();
        this.initialize(index);
    },
    showThis(){//显示动画
        this.enterpot.active = true;
        this.enterpot.runAction(Global.openAction);
        this.initialize(0);
    },
    showConDia(){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }

        Global.conLayer.parent = this.root;
        Global.conLayer.active = true;

        var dia = cc.instantiate(this.conDia);
        dia.parent = this.root;
        dia.getComponent('ConfirmDia').setBoxFun('111',function(){
            cc.log('ok');
        },function(){
            cc.log('no');
        });
        dia.getComponent('ConfirmDia').showThis();
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
