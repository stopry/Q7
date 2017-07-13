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
    },

    // use this for initialization
    onLoad: function () {
        this.openRechargeBtn.on(cc.Node.EventType.TOUCH_END,this.openRechargeBox,this);
        this.openEnterpotBtn.on(cc.Node.EventType.TOUCH_END,this.openEnterpot,this);
        this.openStudyRoomBtn.on(cc.Node.EventType.TOUCH_END,this.openStudyRoom,this);
        this.openLogBtn.on(cc.Node.EventType.TOUCH_END,this.openLog,this);
    },
    opendNormalLayer(){//打开普通遮罩层
        if(!Global.layer||!Global.layer.name){
            Global.layer = cc.instantiate(this.alertLayer);
        }
        Global.layer.parent = this.root;
        Global.layer.active = true;
    },
    openRechargeBox(){//打开充值框
        if(!Global.layerRecharge||!Global.layerRecharge.name){
            Global.layerRecharge = cc.instantiate(this.alertLayer);
        }
        Global.layerRecharge.parent = this.root;
        Global.layerRecharge.active = true;
        var dia = cc.instantiate(this.recharge);
        dia.parent = this.root;
        dia.getComponent('Recharge').showThis();

    },
    openEnterpot(){//打开仓库
        this.opendNormalLayer();
        var ent = cc.instantiate(this.enterpot);
        ent.parent = this.root;
        ent.getComponent('EnterpotControl').showThis();
    },
    openStudyRoom(){//打开科研所
        this.opendNormalLayer();
        var ent = cc.instantiate(this.studyRoom);
        ent.parent = this.root;
        ent.getComponent('StudyRoom').showThis();
    },
    openLog(){//打开日志
        this.opendNormalLayer();
        var log = cc.instantiate(this.log);
        log.parent = this.root;
        log.getComponent('Log').showThis();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
