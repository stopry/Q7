cc.Class({
    extends: cc.Component,

    properties: {
        backLogin:{
            default:null,
            type:cc.Node
        },
        userPic:{//用户头像
            default:null,
            type:cc.Sprite
        },
        headerInfo:[cc.Label],//头部信息
        spriteList: {//用户图片列表
            default: [],
            type: [cc.SpriteFrame]
        },
        treeList:{//12个林场列表
            default:[],
            type:[cc.Node]
        },
        treePic:{//树木图片
            default:[],
            type:[cc.SpriteFrame]
        },
        statusPic:{//状态图片
            default:[],
            type:[cc.SpriteFrame]
        }
    },
    // use this for initialization
    onLoad: function () {
        cc.director.setDisplayStats(false);
        this.renderAllTree();
        this.setHeader();
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    setHeader(){//设置头部
        if(this.getPerNode()){
            this.headerInfo[0].string = this.perNode.getComponent('PersistNode').userData.selfInfo.nickname;
            this.headerInfo[1].string = this.perNode.getComponent('PersistNode').userData.selfInfo.level||10;
            this.headerInfo[2].string = this.perNode.getComponent('PersistNode').userData.selfInfo.jewel||0;
            this.headerInfo[3].string = this.perNode.getComponent('PersistNode').userData.selfInfo.money||0;
            this.userPic.spriteFrame = this.spriteList[parseInt(this.perNode.getComponent('PersistNode').userData.selfInfo.pic)-1||0];
        };
    },
    renderAllTree(){//渲染整个林场


        if(this.getPerNode()){
            this.lands = this.getPerNode().getComponent('PersistNode').userData.selfInfo.lands;//土地列表
        }
        for(var i = 0;i<this.treeList.length;i++){
            this.renderTree(
                this.treeList[i],
                this.lands[i].status,
                this.lands[i].status,
                this.lands[i].id,
                this.lands[i].pdId
            );
        }

        //var self = this;
        //;[].forEach.call(this.treeList,function(item){
        //    item.on(cc.Node.EventType.TOUCH_END,function(event){
        //
        //    },self);
        //});
        //this.renderTree(this.treeList[0],1,1);
    },
    renderTree(tree,type,status,id,pdId){//渲染单个林场——类型-状态
        tree.getChildByName('tree').getComponent(cc.Sprite).spriteFrame = this.treePic[type-1];
        tree.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[status-1];
        tree.on(cc.Node.EventType.TOUCH_END,function(){
            if(this.getPerNode()){
                this.perNode.getComponent('PersistNode').userData.curLandId = id;//当前进入的土地id
                this.perNode.getComponent('PersistNode').userData.curPdId = pdId;//当前进入的pId
                cc.log(this.perNode.getComponent('PersistNode').userData.curLandId,this.perNode.getComponent('PersistNode').userData.curPdId = id);
            }
            //场景跳转
            cc.director.loadScene("PlantDetail",function(){//回调

            });
        },this);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
