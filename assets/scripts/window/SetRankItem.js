cc.Class({
    extends: cc.Component,

    properties: {
        id:{//玩家id
            default:null,
            type:cc.Label
        },
        nickname:{//玩家昵称
            default:null,
            type:cc.Label
        },
        level:{//玩家等级
            default:null,
            type:cc.Label
        },
        treasure:{//玩家财富
            default:null,
            type:cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    setItem(id,nickname,level,treasure){//设置日志item显示
        this.id.string = id;
        this.nickname.string = nickname;
        this.level.string = level;
        this.treasure.string = treasure;
    },
    goFriendsHome(){//去玩家家园
        cc.director.loadScene("PlantDetail",function(){//回调

        });
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});