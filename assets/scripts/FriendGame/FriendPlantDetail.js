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
        _stage:0,//树的生长阶段
        tree_1:[cc.SpriteFrame],//柳树
        tree_2:[cc.SpriteFrame],//松树
        tree_3:[cc.SpriteFrame],//槐树
        tree_4:[cc.SpriteFrame],//梧桐
        tree_5:[cc.SpriteFrame],//杉树
        tree_6:[cc.SpriteFrame],//银杏
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
    steal(){//偷玩家绿能
        var self = this;
        var plantData = {//
            "greenId": 0,
            "toId": 0
        };
        Net.post('/api/game/steal',1,plantData,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('偷取成功');
            }
        }.bind(this),function(){

        }.bind(this));
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
