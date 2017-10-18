cc.Class({
    extends: cc.Component,

    properties: {
        id:null,//物品id
        changePrice:{//价格涨跌幅，上面的数字
            default:null,
            type:cc.RichText
        },
        changeRate:{//汇率涨跌幅，下面的文字
            default:null,
            type:cc.RichText
        },
        itmePic:{//商品图片
            default:null,
            type:cc.Sprite
        },
        itmeName:{//商品名字
            default:null,
            type:cc.RichText
        },
        numTop:{
            default:null,
            type:cc.Node
        },
        numBot:{
            default:null,
            type:cc.Node
        },
        itemBox:{
            default:null,
            type:cc.Node
        }
    },
    // use this for initialization
    onLoad: function () {
        //this.action = cc.sequence(cc.scaleTo(0.8, 0, 1),cc.scaleTo(0.8, 1, 1));
        this.itemBox.on(cc.Node.EventType.TOUCH_END,this.toMarket,this);
    },
    //去市场
    toMarket(){
        let token = cc.sys.localStorage.getItem('token');
        let id = this.id;
        //cc.sys.openURL('http://www.qq.com/')
    },
    //初始化商品项
    setItem(id,changePrice,changeRate,itmePic,itmeName){
        this.id = id;
        this.changePrice.string = "<color=#ffffff><outline color=#42230e width=2>"+changePrice+"</outline></color>";
        this.changeRate.string = "<color=#ff0000><outline color=#42230e width=2>"+changeRate+"</outline></color>";
        this.itmePic.spriteFrame = itmePic;
        this.itmeName.string = "<color=#ffee33><outline color=#562b04 width=2>"+itmeName+"</outline></color>";
    },
    updateItem(changePrice,changeRate){
        this.numTop.runAction(cc.sequence(cc.scaleTo(0.3, 1, 0),cc.scaleTo(0.3, 1, 1)));
        this.numBot.runAction(cc.sequence(cc.scaleTo(0.3, 1, 0),cc.scaleTo(0.3, 1, 1)));
        this.changePrice.string = "<color=#ffffff><outline color=#42230e width=2>"+changePrice+"</outline></color>";
        this.changeRate.string = "<color=#ff0000><outline color=#42230e width=2>"+changeRate+"</outline></color>";
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
