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
        this.initialize(0);
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
        var item = null;
        for(var i = 0;i<30;++i){
            if((this.itemPool[this.type]).length>0){
                item = (this.itemPool[this.type]).shift();
            }else{
                item = cc.instantiate(this.itemTemplate);
            }
            this.content[type].addChild(item);
            item.getComponent('SetEnterpotItem').setItme(type,i,i+"",i+"");
            //this.items.push(item);
        }
    },
    showThis(){//显示动画
        this.enterpot.active = true;
        this.enterpot.runAction(Global.openAction);
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
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
