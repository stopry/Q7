var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        //确认框资源start
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
        //确认框资源end
        shopItemBox:{//商店列表项容器
            default:null,
            type:cc.Node
        },
        ItemPre:{//商品列表项预制
            default:null,
            type:cc.Prefab
        },
        nextBtn:{//下一页按钮
            default:null,
            type:cc.Node
        },
        preBtn:{//上一页按钮
            default:null,
            type:cc.Node
        },
        cuurentPage:{//当前页数
            default:null,
            type:cc.Label
        },
        allPage:{//总页数
            default:null,
            type:cc.Label
        },
        littleTip:{//小提示
            default:null,
            type:cc.Prefab
        },
        content:{//商品容器数组
            default:[],
            type:[cc.Node]
        },
        shopType:{//当前显示的容器类型
            default:1,
            type:cc.Integer
        },
        btnBgList:{
            default:[],
            type:[cc.SpriteFrame],//table切换按钮背景图
        },
        tableBtn:{//切换按钮
            default:[],
            type:[cc.Node]
        }
    },
    // use this for initialization
    onLoad: function () {
        this.curPageNum = 1;//默认当前页
        this.allPageNum = 10;//默认总页数
        this.isLoading = false;//默认不在加载中
        this.renderShopList();
        this.nextBtn.on(cc.Node.EventType.TOUCH_END,function(){
            this.nextPage();
        },this);
        this.preBtn.on(cc.Node.EventType.TOUCH_END,function(){
            this.prePage();
        },this);
    },
    changeBox(event,customEventData){//切换列表容器
        if(customEventData=='0'){
            this.shopType=1;//树苗
            this.tableBtn[0].getComponent(cc.Sprite).spriteFrame = this.btnBgList[1];
            this.tableBtn[1].getComponent(cc.Sprite).spriteFrame = this.btnBgList[2];
        }else{
            this.shopType=2;//道具
            this.tableBtn[0].getComponent(cc.Sprite).spriteFrame = this.btnBgList[0];
            this.tableBtn[1].getComponent(cc.Sprite).spriteFrame = this.btnBgList[3];
        }
        var index = parseInt(customEventData)||0;
        for(let i = 0;i<this.content.length;i++){
            this.content[i].active = false;
        }
        this.content[index].active = true;
    },
    renderShopList(){//渲染商店列表
        if(this.shopItemBox.name=='treeBox'){
            this.loadShopData(1);
        }else{
            this.loadShopData(2);
        }
    },
    loadShopData(type){//加载商店数据
        Net.get('/api/game/store/list',1,{type:type},function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
                return
            }else{
                this.shopItemBox.removeAllChildren();
                var shopList = data.obj;
                if(shopList.length<=0)return;
                for(let i = 0;i<shopList.length;i++){
                    let shopItem = cc.instantiate(this.ItemPre);
                    this.shopItemBox.addChild(shopItem);
                    shopItem.getComponent('SetShopItem').setItem(
                        parseInt(((shopList[i].itemId).toString()).split('')[3])-1,//商品图片
                        '<outline color=#562B04 width=2>'+shopList[i].name+'</outline>',//商品名字
                        shopList[i].desc,//商品介绍
                        '<color=#ff0000>'+shopList[i].price+'</c><color=#ffffff><outline color=#562B04 width=2>元/个</outline></color>',//商品价格
                        shopList[i].itemId,//商品id
                        shopList[i].itemType//商品类型
                    );
                }
                //this.allPage.string = this.allPageNum;
                //this.cuurentPage.string = this.curPageNum;
            }
        }.bind(this),function(err){

        }.bind(this))
    },
    //nextPage(){
    //    if(this.curPageNum>=this.allPageNum){
    //        this.showLittleTip('没有下一页了');
    //        return
    //    };
    //    this.curPageNum++;
    //    this.renderShopList();
    //},
    //prePage(){
    //    if(this.curPageNum<=1){
    //        this.showLittleTip('没有上一页');
    //        return
    //    };
    //    this.curPageNum--;
    //    this.renderShopList();
    //},
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    showConDia(msg,fn1,fn2){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = this.root;
        Global.conLayer.active = true;

        var dia = cc.instantiate(this.conDia);
        dia.parent = this.root;
        dia.getComponent('ConfirmDia').setBoxFun(msg,fn1,fn2);
        dia.getComponent('ConfirmDia').showThis();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
