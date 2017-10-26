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
        boxTitile:{//仓库标题
            default:null,
            type:cc.Sprite
        },
        titlePic:{//标题图片
            default:[],
            type:[cc.SpriteFrame]
        },
        cBtn:{//四个切换按钮
            default:[],
            type:[cc.Node]
        },
        btnNormal:{//切换按钮正常状态
            default:[],
            type:[cc.SpriteFrame]
        },
        btnActive:{//切换按钮激活状态
            default:[],
            type:[cc.SpriteFrame]
        },
        activeBtnBg:{//激活按钮的背景
            default:null,
            type:cc.Node
        },
        //道具图片列表
        treePic:{//树苗
            default:[],
            type:[cc.SpriteFrame]
        },
        woodPic:{//树苗
            default:[],
            type:[cc.SpriteFrame]
        },
        propPic:{//树苗
            default:[],
            type:[cc.SpriteFrame]
        },
        tanPic:{//树苗
            default:[],
            type:[cc.SpriteFrame]
        }
    },
    // use this for initialization
    onLoad: function () {
        this.type = 0;
        this.createEntItemPool();
        this.items = [];
    },
    createEntItemPool(){//仓库item对象池
        this.itemPool = [
            new cc.NodePool(),
            new cc.NodePool(),
            new cc.NodePool(),
            new cc.NodePool()
        ];
    },
    initialize:function(type){//0123——树苗-道具-木材-碳汇
        this.type = type;//仓库类型
        //cc.log(this.type);
        var itemLen = this.content[this.type].getChildren().length;//子节点数量
        for(var l = 0;l<itemLen;l++){
            (this.itemPool[this.type]).put(this.content[this.type].getChildren()[0]);
        }
        this.getEnterData(type);
    },
    getEnterData(type){//得到仓库信息
        var type = type+1||1;
        var propList = null;
        Net.get('/api/game/getPlayerItemList',1,{type:type},function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else if(data.obj.length<=0){
                //this.showLittleTip('没有物品信息!');
            }else{
                var _len = data.obj.length;
                var item = null;
                for(var i = 0;i<_len;i++){
                    if((this.itemPool[this.type]).size()>0){
                        item = (this.itemPool[this.type]).get();
                    }else{
                        item = cc.instantiate(this.itemTemplate);
                    }
                    this.content[type-1].addChild(item);
                    if(type==1){
                        propList=this.treePic;
                    }else if(type==2){
                        propList=this.woodPic;
                    }else if(type==3){
                        propList=this.propPic;
                    }else{
                        propList=this.tanPic;
                    }
                    item.getComponent('SetEnterpotItem').setItme(
                        propList[parseInt(((data.obj[i].itemTypeId).toString()).split('')[3])-1],//物品图片
                        data.obj[i].cnt,//物品数量
                        data.obj[i].name,//物品名字
                        data.obj[i].desc//物品描述
                    );
                }
            }
        }.bind(this),function(err){

        }.bind(this))
    },
    changeBox(event,customEventData){//切换列表容器
        //customEventData——0 1 2 3 树苗 道具 木材 碳汇
        var index = parseInt(customEventData)||0;
        if(this.type==index){//不是切换不做任何请求
            return;
        };
        for(let i = 0;i<this.content.length;i++){
            this.content[i].active = false;
            this.cBtn[i].getComponent(cc.Sprite).spriteFrame = this.btnNormal[i];
        }
        //仓库标题设置
        this.boxTitile.spriteFrame = this.titlePic[index];
        //切换按钮激活状态设置
        this.cBtn[index].getComponent(cc.Sprite).spriteFrame = this.btnActive[index];
        //显示切换到的仓库
        this.content[index].active = true;
        //设置激活按钮背景图位置
        var pos = event.target.getPosition();
        var action = cc.moveTo(0.1,pos);
        this.activeBtnBg.runAction(action);
        this.initialize(index);
    },
    showThis(){//显示动画
        this.enterpot.active = true;
        this.enterpot.runAction(Global.openAction);
        this.initialize(this.type);
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
            //cc.log('ok');
        },function(){
            //cc.log('no');
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
