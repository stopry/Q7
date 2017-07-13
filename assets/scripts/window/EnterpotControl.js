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
        this.items = [];
        this.initialize();;
    },
    initialize:function(){
        var k = 0
        for(let i = 0;i<30;++i){
            let item = cc.instantiate(this.itemTemplate);
            this.content[1].addChild(item);
            item.getComponent('SetEnterpotItem').setItme(0,k,k+"",k+"");
            k++;
            this.items.push(item);
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
        for(let i = 0;i<this.content.length;i++){
            this.content[i].active = false;
        }
        this.content[index].active = true;
        if(index==3){
            this.showConDia();
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
