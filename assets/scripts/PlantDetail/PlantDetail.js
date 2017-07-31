var Net = require('Net');
cc.Class({
    extends: cc.Component,
    properties: {
        plane:{//飞机
            default:null,
            type:cc.Node
        },
        plantBtn:{//种植按钮
            default:null,
            type:cc.Button
        },
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
        greenEne.getComponent('GreenEnergy').initGreenEnergy(1,2,this.treeBox.getPosition(),1);
    },
    resetPlane(vec){//重置飞机
        this.scheduleOnce(function() {
            this.plane.setPosition(vec);
            this.plane.getComponent(cc.Animation).stop();
            this.plane.active = false;
            this.plantBtn.interactable = true;
        },4.1);
    },
    playPlane(){//播放飞机
        //this.plantBtn.enabled = false;
        this.plantBtn.interactable = false ;
        var pos = this.plane.getPosition();
        var finished = cc.callFunc(this.resetPlane(pos));
        this.plane.active = true;
        this.plane.getComponent(cc.Animation).play();
        var actionTo = cc.sequence(cc.moveBy(4, cc.p(840, 0)), cc.fadeIn(0), finished);
        this.plane.runAction(actionTo);
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
    plant(){//种植
        var self = this;
        var plantData = {//种植提交数据
            "landId": (function(){if(this.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curTreeId;
            }})()||0,
            "treeId": 1001
        };
        Net.post('/api/game/plant',1,plantData,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('播种成功');
            }
        }.bind(this),function(data){
            this.showLittleTip('网络错误');
        }.bind(this));
    },
    apply(){//施肥
        var self = this;
        var plantData = {//
            "landId": (function(){if(this.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curTreeId;
            }})()||0,
            "itemId": 1001
        };
        Net.post('/api/game/apply',1,plantData,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('施肥成功')
            }
        }.bind(this),function(){

        }.bind(this));
    },
    debug(){//除虫
        var self = this;
        var plantData = {//
            "landId": (function(){if(this.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curTreeId;
            }})()||0
        };
        Net.post('/api/game/debug',1,plantData,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('除虫成功')
            }
        }.bind(this),function(){

        }.bind(this));
    },
    grass(){//除草
        var self = this;
        var plantData = {//
            "landId": (function(){if(this.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curTreeId;
            }})()||0
        };
        Net.post('/api/game/grass',1,plantData,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('除草成功');
            }
        }.bind(this),function(){

        }.bind(this));
    },
    pick(){//收取绿能
        var self = this;
        var plantData = {//
            "greenId": 1
        };
        Net.post('/api/game/pick',1,plantData,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('收取成功');
            }
        }.bind(this),function(){

        }.bind(this));
    },
    shovel(){//收获树木
        var self = this;
        var plantData = {//
            "landId": (function(){if(this.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curTreeId;
            }})()||0,
            "neglectSts": false
        };
        Net.post('/api/game/shovel',1,plantData,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('收取成功');
            }
        }.bind(this),function(){

        }.bind(this));
    },
    water(){//收获树木
        var self = this;
        var plantData = {//
            "landId": (function(){if(this.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curTreeId;
            }})()||0,
        };
        Net.post('/api/game/water',1,plantData,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('浇水成功');
            }
        }.bind(this),function(){

        }.bind(this));
    },
    back(){//返回主游戏界面

        cc.director.loadScene("Game",function(){//回调

        });
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
