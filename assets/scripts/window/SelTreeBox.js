var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        root:{//根节点
            default:null,
            type:cc.Node
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        treeItemBox:{//树苗列表容器
            default:null,
            type:cc.Node
        },
        treeItem:{//树苗item预制
            default:null,
            type:cc.Prefab
        },
        littleTip:{//小提示
            default:null,
            type:cc.Prefab
        },
        treePicList:[cc.SpriteFrame],//树苗图片列表
        treeId:{//树苗id
            default:null,
            type:cc.Integer
        },
    },
    // use this for initialization
    onLoad: function () {
        this.isLoading = false;
        this.createItemPool();
    },
    createItemPool(){//对象池
        this.itemPool = new cc.NodePool();
    },
    renderTreeList(){//渲染树苗列表
        var itemLen = this.treeItemBox.getChildren().length;
        for(var l = 0;l<itemLen;l++){
            this.itemPool.put(this.treeItemBox.getChildren()[0]);
        }
        this.getTreeData();
    },
    getTreeData(){//得到树苗数据
        this.isLoading = true;
        this.treeArr = [];//存放当前树苗列表
        Net.get('/api/game/getPlayerItemList',1,{type:1},function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else if(!data.obj||data.obj.length<=0){
                this.showThis('没有树苗');
            }else{
                var item = null;
                for(let i = 0;i<data.obj.length;i++){
                    if(this.itemPool.size()>0){
                        item = this.itemPool.get();
                    }else{
                        item = cc.instantiate(this.treeItem);
                    }
                    this.treeItemBox.addChild(item);
                    this.treeArr.push(item);
                    item.getComponent('SelTreeItem').setItem(
                        data.obj[i].itemTypeId,//id
                        this.treePicList[parseInt(data.obj[i].pic)-1],//图片
                        data.obj[i].name,//名字
                        data.obj[i].desc,//介绍
                        data.obj[i].cnt//数量
                    );
                }
            }
            this.isLoading = false;
            this.selTree();
        }.bind(this),function(data){
            this.isLoading = false;
        }.bind(this))
    },
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
        this.renderTreeList()
    },
    selTree(){//选择树苗
        var self = this;
        ;[].forEach.call(self.treeArr,function(item){
            item.on(cc.Node.EventType.TOUCH_END,function(event){
                for(let i = 0;i<self.treeArr.length;i++){
                    self.treeArr[i].getComponent('SelTreeItem').checkIcon.active = false;
                }
                self.treeId = item.getComponent('SelTreeItem').id;//得到当前树苗id
                item.getComponent('SelTreeItem').checkIcon.active = true;
                //cc.log(item.getComponent('SelTreeItem').id);
            },self);
        });
    },
    confirmPlant(){//点击确定种植
        var self = this;
        if(!this.treeId){
            this.showLittleTip('请先选择树苗');
            return;
        }
        cc.find('PlantDetail').getComponent('PlantDetail').plant(this.treeId);
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
