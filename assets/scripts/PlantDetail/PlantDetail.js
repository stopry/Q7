var Net = require('Net');
var util = require('Util');
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
        _stage:0,//树的生长阶段
        trees:[cc.Node],//全部的树节点
        tree_1:[cc.SpriteFrame],//柳树
        tree_2:[cc.SpriteFrame],//松树
        tree_3:[cc.SpriteFrame],//槐树
        tree_4:[cc.SpriteFrame],//梧桐
        tree_5:[cc.SpriteFrame],//杉树
        tree_6:[cc.SpriteFrame],//银杏
        stump:cc.SpriteFrame,//树桩
    },
    // use this for initialization
    onLoad: function () {
        eruda.get('console').config.set('overrideConsole', false);
        this.greenPool = new cc.NodePool();
        this.greenEnergyArray = [];//存放绿能数组
        // 关闭fps
        cc.director.setDisplayStats(false);
        this.renderTree();
        this.createGreenEnergy();
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    renderTree(){
        if(this.getPerNode()){
            this.curLandId = this.perNode.getComponent('PersistNode').userData.curLandId;//得到当前土地的id
            this.pdId = this.perNode.getComponent('PersistNode').userData.curPdId;//得到当前土地的pdId
            this.treeDetails = this.perNode.getComponent('PersistNode').userData.selfInfo.playerPlantingDetail;//得到全部种植详情
            if(this.treeDetails.length<=0){//如果全部种植详情为空
                this.initTree(this.stump);
            }else{//如果全部种植详情不为空
                //查找当前种植详情
                this.plantDetail = util.getCurPlantDetail(this.pdId,this.treeDetails)
                if(!this.plantDetail){//没有种植详情
                    this.initTree(this.stump);
                }else{//有种植详情
                    var type = (parseInt(this.plantDetail.treeId)-1000);//树的类型 123456
                    var status = this.plantDetail.status;//树的状态0-种植期 1-成长期 2-成熟期 3-死亡期
                    var disaster = this.plantDetail.disaster;//树的灾害类型 0-无 1-虫 2-草 3-干旱

                    if(status==3){//死亡期
                        this.initTree(this.stump);
                        return;
                    }
                    if(type==1&&disaster==0){
                        this.initTree(this.tree_1[status])
                    }else if(type==1&&disaster==1){
                        this.initTree(this.tree_1[4])
                    }else if(type==1&&disaster==2){
                        this.initTree(this.tree_1[6])
                    }else if(type==1&&disaster==3){
                        this.initTree(this.tree_1[5])
                    }

                    if(type==2&&disaster==0){
                        this.initTree(this.tree_2[status])
                    }else if(type==2&&disaster==1){
                        this.initTree(this.tree_2[4])
                    }else if(type==2&&disaster==2){
                        this.initTree(this.tree_2[6])
                    }else if(type==2&&disaster==3){
                        this.initTree(this.tree_2[5])
                    }

                    if(type==3&&disaster==0){
                        this.initTree(this.tree_3[status])
                    }else if(type==3&&disaster==1){
                        this.initTree(this.tree_3[4])
                    }else if(type==3&&disaster==2){
                        this.initTree(this.tree_3[6])
                    }else if(type==3&&disaster==3){
                        this.initTree(this.tree_3[5])
                    }

                    if(type==4&&disaster==0){
                        this.initTree(this.tree_4[status])
                    }else if(type==4&&disaster==1){
                        this.initTree(this.tree_4[4])
                    }else if(type==4&&disaster==2){
                        this.initTree(this.tree_4[6])
                    }else if(type==4&&disaster==3){
                        this.initTree(this.tree_4[5])
                    }

                    if(type==5&&disaster==0){
                        this.initTree(this.tree_5[status])
                    }else if(type==5&&disaster==1){
                        this.initTree(this.tree_5[4])
                    }else if(type==5&&disaster==2){
                        this.initTree(this.tree_5[6])
                    }else if(type==5&&disaster==3){
                        this.initTree(this.tree_5[5])
                    }

                    if(type==6&&disaster==0){
                        this.initTree(this.tree_6[status])
                    }else if(type==6&&disaster==1){
                        this.initTree(this.tree_6[4])
                    }else if(type==6&&disaster==2){
                        this.initTree(this.tree_6[6])
                    }else if(type==6&&disaster==3){
                        this.initTree(this.tree_6[5])
                    }
                }
            }
        }
    },
    initTree(_sprite){
        for(let i = 0;i<this.trees.length;i++){
            (this.trees[i].getComponent(cc.Sprite)).spriteFrame = _sprite;
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
                return self.perNode.getComponent('PersistNode').userData.curLandId;
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
                return self.perNode.getComponent('PersistNode').userData.curLandId;
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
                return self.perNode.getComponent('PersistNode').userData.curLandId;
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
                return self.perNode.getComponent('PersistNode').userData.curLandId;
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
    cut(){//砍伐树木
        var self = this;
        var plantData = {//
            "landId": (function(){if(this.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curLandId;
            }})()||0,
            "neglectSts": false
        };
        Net.post('/api/game/cut',1,plantData,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('收取成功');
            }
        }.bind(this),function(){

        }.bind(this));
    },
    water(){//浇水
        var self = this;
        var plantData = {//
            "landId": (function(){if(this.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curLandId;
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
