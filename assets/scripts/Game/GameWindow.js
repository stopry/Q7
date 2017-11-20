cc.Class({
    extends: cc.Component,

    properties: {
        root:{//root
            default:null,
            type:cc.Node
        },
        alertLayer:{//第一层遮罩层
            default:null,
            type:cc.Prefab
        },
        //充值框start
        recharge:{//充值框
            default:null,
            type:cc.Prefab
        },
        openRechargeBtn:{//打开充值按钮
            default:null,
            type:cc.Node
        },
        //充值框end

        //仓库start
        enterpot:{//仓库弹框
            default:null,
            type:cc.Prefab
        },
        openEnterpotBtn:{//打开仓库弹框按钮
            default:null,
            type:cc.Node
        },
        //仓库end

        //科研所start
        studyRoom:{//仓库弹框
            default:null,
            type:cc.Prefab
        },
        openStudyRoomBtn:{//打开仓库弹框按钮
            default:null,
            type:cc.Node
        },
        //科研所end

        //日志start
        log:{//仓库弹框
            default:null,
            type:cc.Prefab
        },
        openLogBtn:{//打开仓库弹框按钮
            default:null,
            type:cc.Node
        },
        //日志end

        //好友start
        friends:{//仓库弹框
            default:null,
            type:cc.Prefab
        },
        openFriendsBtn:{//打开仓库弹框按钮
            default:null,
            type:cc.Node
        },
        //好友end

        //商店start
        shop:{//商店弹框
            default:null,
            type:cc.Prefab
        },
        openShopBtn:{//打开商店弹框按钮
            default:null,
            type:cc.Node
        },
        //商店end

        //排行榜start
        rank:{//排行榜弹框
            default:null,
            type:cc.Prefab
        },
        openRankBtn:{//打开排行榜弹框按钮
            default:null,
            type:cc.Node
        },
        //排行榜end

        //设置start
        set:{//设置框
            default:null,
            type:cc.Prefab
        },
        openSetBtn:{//打开设置弹框按钮
            default:null,
            type:cc.Node
        },
        //设置end

        //市场start
        market:{//仓库弹框
            default:null,
            type:cc.Prefab
        },
        openMarketBtn:{//打开市场弹框按钮
            default:null,
            type:cc.Node
        },
        //市场end

        //公告start
        announceBox:{//公告弹框
            default:null,
            type:cc.Prefab
        },
        announceBtn:{//打开公共弹框的按钮
            default:null,
            type:cc.Node
        },
        //公告end

        //工厂start
        factoryBox:{
            default:null,
            type:cc.Prefab
        },
        factoryBtn:{
            default:null,
            type:cc.Node
        },
        //工厂end
    },

    // use this for initialization
    onLoad: function () {
        //this.preInsPrefabs();
        this.openRechargeBtn.on(cc.Node.EventType.TOUCH_END,this.openRechargeBox,this);
        this.openEnterpotBtn.on(cc.Node.EventType.TOUCH_END,this.openEnterpot,this);
        this.openStudyRoomBtn.on(cc.Node.EventType.TOUCH_END,this.openStudyRoom,this);
        this.openLogBtn.on(cc.Node.EventType.TOUCH_END,this.openLog,this);
        this.openFriendsBtn.on(cc.Node.EventType.TOUCH_END,this.openFriends,this);
        this.openShopBtn.on(cc.Node.EventType.TOUCH_END,this.openShop,this);
        this.openRankBtn.on(cc.Node.EventType.TOUCH_END,this.openRank,this);
        this.openSetBtn.on(cc.Node.EventType.TOUCH_END,this.openSet,this);
        this.openMarketBtn.on(cc.Node.EventType.TOUCH_END,this.openMarket,this);
        this.announceBtn.on(cc.Node.EventType.TOUCH_END,this.openAnnounceBox,this);
        this.factoryBtn.on(cc.Node.EventType.TOUCH_END,this.openFactoryBox,this);
    },
    //预初始化预制资源（一些弹窗），解决第一次打开卡顿现象
    preInsPrefabs(){
        //普通遮罩层
        if(!Global.layer||!Global.layer.name){
            Global.layer = cc.instantiate(this.alertLayer);
        }
        //充值弹窗
        if(!Global.recharge||!Global.recharge.name){
            Global.recharge = cc.instantiate(this.recharge);
        }
        //仓库
        if(!Global.ent||!Global.ent.name){
            Global.ent = cc.instantiate(this.enterpot);
        }
        //科研所
        if(!Global.studyRoom||!Global.studyRoom.name){
            Global.studyRoom = cc.instantiate(this.studyRoom);
        }
        //日志
        if(!Global.log||!Global.log.name){
            Global.log = cc.instantiate(this.log);
        }
        //好友
        if(!Global.friends||!Global.friends.name){
            Global.friends = cc.instantiate(this.friends);
        }
        //商店
        if(!Global.shop||!Global.shop.name){
            Global.shop = cc.instantiate(this.shop);
        }
        //排行榜
        if(!Global.rank||!Global.rank.name){
            Global.rank = cc.instantiate(this.rank);
        }
        //设置
        if(!Global.setBox||!Global.setBox.name){
            Global.setBox = cc.instantiate(this.set);
        }
        //公告
        if(!Global.AnnounceBoxs||!Global.AnnounceBoxs.name){
            Global.AnnounceBoxs = cc.instantiate(this.announceBox);
        }
    },
    opendNormalLayer(){//打开普通遮罩层
        if(!Global.layer||!Global.layer.name){
            Global.layer = cc.instantiate(this.alertLayer);
        }
        Global.layer.parent = this.root;
        Global.layer.active = true;
    },
    openRechargeBox(){//打开充值框
        if(Global.tranActive.exchange=='0') return;
        //充值弹窗遮罩层
        if(!Global.layerRecharge||!Global.layerRecharge.name){
            Global.layerRecharge = cc.instantiate(this.alertLayer);
        }
        Global.layerRecharge.parent = this.root;
        Global.layerRecharge.active = true;
        //充值弹窗
        if(!Global.recharge||!Global.recharge.name){
            Global.recharge = cc.instantiate(this.recharge);
        }
        Global.recharge.parent = this.root;
        Global.recharge.getComponent('Recharge').showThis();

    },
    openEnterpot(){//打开仓库
        this.opendNormalLayer();
        if(!Global.ent||!Global.ent.name){
            Global.ent = cc.instantiate(this.enterpot);
        }
        Global.ent.parent = this.root;
        Global.ent.getComponent('EnterpotControl').showThis();
    },
    openStudyRoom(){//打开科研所
        this.opendNormalLayer();
        if(!Global.studyRoom||!Global.studyRoom.name){
            Global.studyRoom = cc.instantiate(this.studyRoom);
        }
        Global.studyRoom.parent = this.root;
        Global.studyRoom.getComponent('StudyRoom').showThis();
    },
    openLog(){//打开日志
        this.opendNormalLayer();
        if(!Global.log||!Global.log.name){
            Global.log = cc.instantiate(this.log);
        }
        Global.log.parent = this.root;
        Global.log.getComponent('Log').showThis();
    },
    openFriends(){//打开好友
        this.getComponent('LittleTip').setContent('功能即将上线，敬请期待！');
        return;
        this.opendNormalLayer();

        if(!Global.friends||!Global.friends.name){
            Global.friends = cc.instantiate(this.friends);
        }
        Global.friends.parent = this.root;
        Global.friends.getComponent('Friends').showThis();
    },
    openShop(){//打开商店
        this.opendNormalLayer();
        if(!Global.shop||!Global.shop.name){
            Global.shop = cc.instantiate(this.shop);
        }
        Global.shop.parent = this.root;
        Global.shop.getChildByName('prop').getComponent('Shop').showThis();
    },
    openRank(){//打开排行榜
        this.getComponent('LittleTip').setContent('功能即将上线，敬请期待！');
        return;
        this.opendNormalLayer();
        if(!Global.rank||!Global.rank.name){
            Global.rank = cc.instantiate(this.rank);
        }
        Global.rank.parent = this.root;
        Global.rank.getComponent('Rank').showThis();
    },
    openSet(){//打开设置
        this.opendNormalLayer();
        if(!Global.setBox||!Global.setBox.name){
            Global.setBox = cc.instantiate(this.set);
        }
        Global.setBox.parent = this.root;
        Global.setBox.getComponent('Set').showThis();
    },
    openMarket(){//打开市场
        if(Global.tranActive.market=='0') return;
        this.opendNormalLayer();
        if(!Global.Market||!Global.Market.name){
            Global.Market = cc.instantiate(this.market);
        }
        Global.Market.parent = this.root;
        Global.Market.getComponent('Market').showThis();
    },
    openAnnounceBox(){//打开公告弹框
        this.opendNormalLayer();
        if(!Global.AnnounceBoxs||!Global.AnnounceBoxs.name){
            Global.AnnounceBoxs = cc.instantiate(this.announceBox);
        }
        Global.AnnounceBoxs.parent = this.root;
        Global.AnnounceBoxs.getComponent('AnnounceBox').showThis();
    },
    openFactoryBox(){//打开工厂弹框
        this.opendNormalLayer();
        if(!Global.FactoryBox||!Global.FactoryBox.name){
            Global.FactoryBox = cc.instantiate(this.factoryBox);
        }
        Global.FactoryBox.parent = this.root;
        Global.FactoryBox.getComponent('FactoryBox').showThis();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
