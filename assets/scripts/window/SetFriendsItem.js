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
    setItem(id,nickname,level){//设置好友列表item显示
        this.id.string = id;
        this.nickname.string = nickname;
        this.level.string = level;
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    goFriendsHome(){//去好友家园
        this.getComponent('ReqAni').showReqAni();
        var friendTreeHeaderData = {
            nickname:'好友农场',
            level:666,
            jewel:456,//钻石
            gold:55,
            pic:3
        };
        if(this.getPerNode()){//设置常驻节点数据向好友农场传参传参
            this.perNode.getComponent('PersistNode').userData.fHeaderInfo = friendTreeHeaderData;
        }
        this.getComponent('ReqAni').hideReqAni();
        cc.director.loadScene("FriendGame",function(){//回调

        }.bind(this));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});