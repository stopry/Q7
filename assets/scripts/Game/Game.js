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
        //this.setHeader();
    },
    setHeader(){//设置头部
        var perNode = cc.director.getScene().getChildByName('PersistNode');
        if(perNode.getComponent('PersistNode').userData.nickName){
            this.headerInfo[0].string = perNode.getComponent('PersistNode').userData.nickName;
            this.userPic.spriteFrame = this.spriteList[perNode.getComponent('PersistNode').userData.userPic-1];
        };
    },
    renderAllTree(){//渲染整个林场
        var json = [
            {
                type:1,
                status:1
            },
            {
                type:2,
                status:2
            },
            {
                type:3,
                status:2
            },
            {
                type:4,
                status:3
            },
            {
                type:5,
                status:3
            },
            {
                type:5,
                status:4
            },
            {
                type:6,
                status:2
            },
            {
                type:2,
                status:4
            },
            {
                type:4,
                status:2
            },
            {
                type:5,
                status:5
            },
            {
                type:2,
                status:2
            },
            {
                type:1,
                status:6
            },
        ];
        for(var i = 0;i<this.treeList.length;i++){
            this.renderTree(this.treeList[i],json[i].type,json[i].status,i);
        }
        //var self = this;
        //;[].forEach.call(this.treeList,function(item){
        //    item.on(cc.Node.EventType.TOUCH_END,function(event){
        //
        //    },self);
        //});
        //this.renderTree(this.treeList[0],1,1);
    },
    renderTree(tree,type,status,id){//渲染单个林场——类型-状态
        tree.getChildByName('tree').getComponent(cc.Sprite).spriteFrame = this.treePic[type-1];
        tree.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[status-1];
        tree.on(cc.Node.EventType.TOUCH_END,function(){
            cc.log(id);
            cc.director.loadScene("PlantDetail",function(){//回调

            });
        },this);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
