//更新常驻节点存储用户信息，更新页面显示用户信息
var Net = require('Net');
cc.Class({
    extends: cc.Component,
    properties: {
        gameCom:{//Game组件挂载的节点
            default:null,
            type:cc.Node
        }
    },
    // use this for initialization
    onLoad: function () {

    },
    refresh(_bool){//加载玩家信息
        var _bool = _bool||false;
        Net.get('/api/game/loadPlayer',1,null,function(data){
            if(!data.success){
                return;
            }else{
                if(this.getPerNode()){
                    this.perNode.getComponent('PersistNode').userData.selfInfo = data.obj;//玩家基本星系赋给常驻节点的selfInfo属性
                    if(_bool){
                        cc.log('update');
                        this.gameCom.getComponent('Game').setHeader();
                    }
                }
            }
        }.bind(this),function(err){

        }.bind(this))
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
