cc.Class({
    extends: cc.Component,

    properties: {
        id:{//好友id
            default:null,
            type:cc.Label
        },
        nickname:{//好友昵称
            default:null,
            type:cc.Label
        },
        level:{//好友等级
            default:null,
            type:cc.Label
        },
        friendsHome:{
            default:null,
            type:cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.friendsHome.on(cc.Node.EventType.TOUCH_END,function(event){
            this.goFriendsHome();
        },this);
    },
    setItem(id,nickname,level){//设置日志item显示
        this.id.string = id;
        this.nickname.string = nickname;
        this.level.string = level;
    },
    goFriendsHome(){//去好友家园
        cc.director.loadScene("PlantDetail",function(){//回调

        });
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});