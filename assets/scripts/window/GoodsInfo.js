//长按显示物品详细信息
cc.Class({
    extends: cc.Component,

    properties: {
        goodsImg:{//物品图片
            default:null,
            type:cc.Sprite
        },
        goodsTitle:{//物品标题
            default:null,
            type:cc.Label
        },
        goodsDesc:{//物品描述
            default:null,
            type:cc.Label
        },
        spriteList:{//物品图片列表
            default:[],
            type:[cc.SpriteFrame]
        }
    },

    onLoad: function () {
        this.node.scale = 0;
    },
    showGoodInfo(img,title,desc){//显示物品信息
        this.goodsImg.spriteFrame = this.spriteList[img];
        this.goodsTitle.string = title;
        this.goodsDesc.string = desc;
        var spawn = cc.sequence(cc.scaleTo(0.3,1,1));
        this.node.runAction(spawn);
    },
    hideGoodInfo(){
        var spawns = cc.spawn(cc.scaleTo(0.1,0,0));
        this.node.runAction(spawns);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
