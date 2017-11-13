var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        littleTip:{//小提示
            default:null,
            type:cc.Prefab
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        conDia:{//确认对话框
            default:null,
            type:cc.Prefab
        },
        id:{//商品id
            default:0,
            type:cc.Integer
        },
        img:{//商品图片
            default:null,
            type:cc.Sprite
        },
        goodsName:{//商品名称
            default:null,
            type:cc.RichText
        },
        goodsDesc:{//商品描述
            default:null,
            type:cc.Label
        },
        goodsPrice:{//商品价格
            default:null,
            type:cc.RichText
        },
        goodsNum:{//商品输入框
            default:null,
            type:cc.EditBox
        },
        addBtn:{//增加按钮
            default:null,
            type:cc.Node
        },
        cutBtn:{//减少按钮
            default:null,
            type:cc.Node
        },
        buyBtn:{//购买按钮
            default:null,
            type:cc.Node
        },
        spriteList: {//树苗图片列表
            default: [],
            type: [cc.SpriteFrame]
        },
        propSpriteList:{//道具图片列表
            default:[],
            type:[cc.SpriteFrame]
        }
    },

    // use this for initialization
    onLoad: function () {
        //cc.log(this.buyBtn);
        if(this.buyBtn){
            this.buyBtn.on(cc.Node.EventType.TOUCH_END,this.buy,this);
        }
        if(this.cutBtn){
            this.cutBtn.on(cc.Node.EventType.TOUCH_END,this.cutNum,this);
        }
        if(this.addBtn){
            this.addBtn.on(cc.Node.EventType.TOUCH_END,this.addNum,this);
        }


    },
    setItem(img,goodsName,goodsDesc,goodsPrice,id,itemType){//设置日志item显示——图片商品名-商品描述-商品价格-id-商品类型
        if(itemType=="1"){
            this.img.spriteFrame = this.spriteList[img];
        }else{
            this.img.spriteFrame = this.propSpriteList[img];
        }
        this.goodsName.string = goodsName;
        this.goodsDesc.string = goodsDesc;
        this.goodsPrice.string = goodsPrice;
        this.id = id;
    },
    addNum(){//增加数量
        var _num = parseInt(this.goodsNum.string);
        if(!_num||_num<1||typeof(_num)!='number'){
            this.goodsNum.string = "1";
        }else{
            this.goodsNum.string = (_num + 1).toString();
        }
    },
    cutNum(){//减少数量
        var _num = parseInt(this.goodsNum.string);
        if(!_num||_num<=1||typeof(_num)!='number'){
            this.goodsNum.string = "1";
        }else{
            this.goodsNum.string = (_num - 1).toString();
        }
    },
    buy(){//购买商品
        var _num = parseInt(this.goodsNum.string);
        if(!_num||_num<1||typeof(_num)!='number'){
            this.showLittleTip('请输入正确数量');
            return;
        }else{
            this.showConDia('确定购买'+_num+'个'+this.goodsName.string+'吗？',function (){
                this.conformBuy();
            }.bind(this),function (){
                //this.showLittleTip('取消购买');
            }.bind(this));
        };
    },
    conformBuy(){//确认购买商品
        var self = this;
        var _num = parseInt(this.goodsNum.string);
        var buyParm = {
            itemId:self.id,
            num:_num,
            // type:1
        };
        this.getComponent('ReqAni').showReqAni();
        Net.get('/api/game/store/buy',1,buyParm,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('购买成功');
                cc.find('Game').getComponent('UpdateUserInfo').refresh(1);
            }
            this.getComponent('ReqAni').hideReqAni();
        }.bind(this),function(err){

        }.bind(this));
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    showConDia(msg,fn1,fn2){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = cc.find('Canvas');
        Global.conLayer.active = true;

        var dia = cc.instantiate(this.conDia);
        dia.parent = cc.find('Canvas');
        dia.getComponent('ConfirmDia').setBoxFun(msg,fn1,fn2);
        dia.getComponent('ConfirmDia').showThis();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});