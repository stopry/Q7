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
        var self = this;
        var promise = new Promise(function(resolve,reject){
            Net.get('/api/game/loadPlayer',1,null,function(data){
                if(!data.success){
                    reject(data.msg);
                    return;
                }else{
                    if(self.getPerNode()){
                        self.perNode.getComponent('PersistNode').userData.selfInfo = data.obj;//玩家基本星系赋给常驻节点的selfInfo属性
                        if(_bool){
                            cc.log('update');
                            self.gameCom.getComponent('Game').setHeader();
                        }
                    }
                    resolve(data.obj);
                }
            }.bind(self),function(err){
                reject(false)
            }.bind(self))
        });
        return promise;//返回promise
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
