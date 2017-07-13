cc.Class({
    extends: cc.Component,

    properties: {
        headIndex:{//头像
            default:1,
            type:cc.Integer
        },
        userName:{//用户名
            default:null,
            type:cc.EditBox
        },
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

        //设置常驻节点参数
        //if(!this.persistNode){
        //    this.persistNode = cc.director.getScene().getChildByName('PersistNode');
        //}
        //this.persistNode.getComponent('PersistNode').userData.nickName = userName;
        //this.persistNode.getComponent('PersistNode').userData.userPic = this.headIndex;

        this.showLittleTip("创建角色成功");
        this.scheduleOnce(function() {//延迟0.5s执行
            cc.director.loadScene("Game",function(){//回调

            });
        }, 0.5);
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
