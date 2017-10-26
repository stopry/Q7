cc.Class({
    extends: cc.Component,

    properties: {
        pic:{//所需材料的图片
            default:null,
            type:cc.Sprite
        },
        cnt:{//所需要的数量
            default:null,
            type:cc.Label
        },
        picList:{//升级证书所需材料图片
            default:[],
            type:[cc.SpriteFrame]
        },
        title:cc.String,//标题
        desc:cc.String,//介绍
        imgIndex:cc.Integer,//物品图片索引
        descPrefab:{//长按介绍预制
            default:null,
            type:cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd,this);
    },
    setItem(img,num,name,desc){//设置显示数据
        /*
        img 所需材料图片
        num 所需数量
        name 材料名字
        desc 材料介绍
        */
        this.imgIndex = img;
        this.pic.spriteFrame = this.picList[img];
        this.cnt.string = num;
        if(img==0){
            name='柳树木'
        }else if(img==1){
            name='松树木'
        }else if(img==2){
            name='槐树木'
        }else if(img==3){
            name='梧桐树木'
        }else if(img==4){
            name='杉树木'
        }else if(img==5){
            name='银杏树木'
        }else if(img==6){
            name="钻石"
        }
        desc = name;
        this.title = name;
        this.desc = desc;
    },
    touchStart(){
        if(!Global.goodsDesc||!Global.goodsDesc.name){
            Global.goodsDesc = cc.instantiate(this.descPrefab);
        }
        let pos = this.node.getPosition();
        Global.goodsDesc.parent = this.node.parent.parent.parent;
        Global.goodsDesc.setPosition(0,120);
        Global.goodsDesc.getComponent('GoodsInfo').showGoodInfo(
            //this.imgIndex,
            this.picList[this.imgIndex],
            this.title,
            this.desc
        );
    },
    touchEnd(){
        Global.goodsDesc.getComponent('GoodsInfo').hideGoodInfo();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
