cc.Class({
    extends: cc.Component,

    properties: {
        id:{//树苗id;
            default:null,
            type:Number
        },
        pic:{//树苗图片
           default:null,
           type:cc.Sprite
        },
        treeName:{//树苗名字
            default:null,
            type:cc.Label
        },
        treeDesc:{//树苗介绍
            default:null,
            type:cc.Label
        },
        treeCnt:{//树苗数量
            default:null,
            type:cc.Label
        },
        checkIcon:{//选中图片
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {

    },
    setItem(id,pic,treeName,treeDesc,treeCnt){//初始化树苗
        this.id = id;
        this.pic.spriteFrame = pic;
        this.treeName.string = treeName;
        this.treeDesc.string = treeDesc;
        this.treeCnt.string = treeCnt;
        this.checkIcon.active = false;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
