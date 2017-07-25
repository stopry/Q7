cc.Class({
    extends: cc.Component,

    properties: {
        treeBox:{//树林容器
            default:null,
            type:cc.Node
        },
        energyPre:{//绿能预制
            default:null,
            type:cc.Prefab
        },
        _stage:0//树的生长阶段
    },

    // use this for initialization
    onLoad: function () {
        this.greenPool = new cc.NodePool();
        this.greenEnergyArray = [];//存放绿能数组
        // 关闭fps
        cc.director.setDisplayStats(false);
        this.renderTree(1,1);
        this.createGreenEnergy();
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    renderTree(status,type){
        this.status = status;
        this.type = type;
        if(this.getPerNode()){
            cc.log("林场id为",this.perNode.getComponent('PersistNode').userData.curTreeId);
        }
    },
    createGreenEnergy(){//创建绿能
        var greenEne = null;
        if(this.greenPool.size()>0){
            greenEne = this.greenPool.get();
        }else{
            greenEne = cc.instantiate(this.energyPre);
        }
        greenEne.parent = cc.find('Canvas');
        this.greenEnergyArray.push(greenEne);//生成的绿能加入数组
        greenEne.getComponent('GreenEnergy').initGreenEnergy(1,2,this.treeBox.getPosition(),0);
    },
    showStage(stage){//根据树的生长阶段显示画面
        switch (stage){
            case 1:
                cc.log(1);
                break;
            case 2:
                cc.log(1);
                break;
            default:
                cc.log(null);
        }
    },
    back(){//返回我的家园
        cc.director.loadScene("Game",function(){//回调

        });
    },
    backFriendTreefarm(){//返回好友林场
        cc.director.loadScene("FriendGame",function(){//回调

        });
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
