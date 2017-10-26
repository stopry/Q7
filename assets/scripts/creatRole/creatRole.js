var Net = require("Net");
cc.Class({
    extends: cc.Component,

    properties: {
        headIndex:{//头像
            default:1,
            type:cc.Integer
        },
        userName:cc.EditBox,
        littleTip:{
            default:null,
            type:cc.Prefab
        },
        root: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.director.setDisplayStats(false);
    },
    toCreat(){//创建
        var userName = (this.userName.string).trim();
        if(!userName){
            this.showLittleTip('请填写角色名');
            return;
        }else if(userName.length>5){
            this.showLittleTip('角色名不能大于5个字符');
            return;
        }
        var self = this;
        var creater = {
            "nickname": userName,
            "pic": self.headIndex
        };
        this.getComponent('ReqAni').showReqAni();
        Net.post('/api/game/createPlayer',1,creater,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
                this.getComponent('ReqAni').hideReqAni();
                return;
            }
            this.loadPlayer();
        }.bind(this),function(err){
            this.showLittleTip("网络错误");
            this.getComponent('ReqAni').hideReqAni();
        }.bind(this));

    },
    loadPlayer(){//加载玩家信息
        Net.get('/api/game/loadPlayer',1,null,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                if(!this.getPerNode()){
                    this.perNode.getComponent('PersistNode').userData.selfInfo = data.obj;//玩家基本星系赋给常驻节点的selfInfo属性
                }
                cc.director.loadScene("Game",function(){//进入主场景

                }.bind(this));
            }
            this.getComponent('ReqAni').hideReqAni();
        }.bind(this),function(err){
            this.showLittleTip('网络异常');
            this.getComponent('ReqAni').hideReqAni();
        }.bind(this))
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
