var Net = require('Net');
var util = require('Util');
cc.Class({
    extends: cc.Component,
    properties: {
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        selTreeBox:{//选择树苗框
            default:null,
            type:cc.Prefab
        },
        root:{//根节点
            default:null,
            type:cc.Node
        },
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
        digAni:[cc.Node],//铲地动画列表
        waterAni:[cc.Node],//浇水动画列表
        cutAni:[cc.Node],//砍树动画列表
        liftAni:{//抬树动画
            default:null,
            type:cc.Node
        },
        walkAni:{//走路动画
            default:null,
            type:cc.Node
        },
        wood:{//木材堆
            default:null,
            type:cc.Node
        },//木材堆
        woodPics:[cc.SpriteFrame]//木材推图片
    },
    // use this for initialization
    onLoad: function () {
        eruda.get('console').config.set('overrideConsole', false);
        this.greenPool = new cc.NodePool();
        this.greenEnergyArray = [];//存放绿能数组
        // 关闭fps
        cc.director.setDisplayStats(false);
        this.resetAni();
        this.renderTree();
        for(var i = 0;i<3;i++){
            this.createGreenEnergy();
        }
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
        //状态 倒计时 树木容器的位置 类型(好友的0，我的1) id(绿能id)
        greenEne.getComponent('GreenEnergy').initGreenEnergy(1,2,this.treeBox.getPosition(),1,10086);
        greenEne.setPosition(this.getRandomPos());
        this.greenEnergyArray.push(greenEne);//生成的绿能加入数组
    },
    getRandomPos(){//得到一个随机位置
        var randX = 0;
        var randY = 0;

        var maxX = cc.find('Canvas').width/2-75;//不会跑出屏幕外
        var maxY = cc.find('Canvas').height/2-208;//不遮盖上下的按钮

        randX = cc.randomMinus1To1()*maxX;
        randY = cc.randomMinus1To1()*maxY;

        //返回随机坐标
        return cc.p(randX,randY);
    },
    resetPlane(vec){//重置飞机
        this.scheduleOnce(function() {
            this.plane.setPosition(vec);
            this.plane.getComponent(cc.Animation).stop();
            this.plane.active = false;
            this.plantBtn.interactable = true;
            this.plantBtn.node.color = cc.Color.WHITE;
        },4.1);
    },
    playPlane(){//播放飞机
        //this.plantBtn.enabled = false;
        this.plantBtn.interactable = false ;
        this.plantBtn.node.color = cc.Color.GRAY;
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
    resetAni(){//重置动画
        this.digAniCtr(!1);
        this.waterAniCtr(!1);
        this.cutAniCtr(!1);
        this.liftAniCtr(!1);
        this.walkAniCtr(!1);
    },
    digAniCtr(_bool){//铲地动画控制
        if(!_bool){
            for(var i = 0;i<this.digAni.length;i++){
                this.digAni[i].active = false;
            }
            return;
        }
        for(var k = 0;k<this.digAni.length;k++){
            this.digAni[k].active = true;
            this.digAni[k].getComponent(cc.Animation).play();
        }
    },
    waterAniCtr(_bool){//浇水动画控制
        if(!_bool){
            for(var i = 0;i<this.waterAni.length;i++){
                this.waterAni[i].active = false;
            }
            return;
        }
        for(var k = 0;k<this.waterAni.length;k++){
            this.waterAni[k].active = true;
            this.waterAni[k].getComponent(cc.Animation).play();
        }
    },
    cutAniCtr(_bool){//砍树动画控制
        if(!_bool){
            for(var i = 0;i<this.cutAni.length;i++){
                this.cutAni[i].active = false;
            }
            return;
        }
        for(var k = 0;k<this.cutAni.length;k++){
            this.cutAni[k].active = true;
            this.cutAni[k].getComponent(cc.Animation).play();
        }
    },
    liftAniCtr(_bool){//抬树动画控制
        if(!_bool){
            this.liftAni.active = false;
            return
        }
        this.liftAni.active = true;
        this.liftAni.getComponent(cc.Animation).play();
        this.scheduleOnce(function(){
            this.wood.getComponent(cc.Sprite).spriteFrame = this.woodPics[1];
        },4.4)
    },
    walkAniCtr(_bool){//走路动画控制
        var self = this;
        if(!_bool){
            if(self){
                clearInterval(self.interVal)
            }
            this.walkAni.active = false;
            return;
        }
        this.walkAni.active = true;
        this.interVal = setInterval(function(){
            self.walkAni.getComponent(cc.Animation).play();
        },20000)
    },
    openTreeBox(){//打开树苗选择框
        if(!Global.layer||!Global.layer.name){
            Global.layer = cc.instantiate(this.alertLayer);
        }
        Global.layer.parent = this.root;
        Global.layer.active = true;
        if(!Global.selTreeBox||!Global.selTreeBox.name){
            Global.selTreeBox = cc.instantiate(this.selTreeBox);
            Global.selTreeBox.parent = this.root;
        }
        Global.selTreeBox.getComponent('SelTreeBox').showThis();
    },
    cut(){//砍伐树木
        this.resetAni();
        this.cutAniCtr(1);
        this.liftAniCtr(1);
        var self = this;
        var plantData = {//
            "landId": (function(){if(self.getPerNode()){
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
    plant(treeId){//种植
        this.playPlane();
        this.resetAni();
        this.digAniCtr(1);
        var self = this;
        var plantData = {//种植提交数据
            "landId": (function(){if(self.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curLandId;
            }})()||0,
            "treeId": treeId
        };
        Net.post('/api/game/plant',1,plantData,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('播种成功');
                Global.selTreeBox.getComponent('CloseWindow').close(event,1);//播种成功后关闭选择种子弹出层
            }
        }.bind(this),function(data){
            this.showLittleTip('网络错误');
        }.bind(this));
    },
    water(){//浇水
        this.resetAni();
        this.waterAniCtr(1);
        var self = this;
        var plantData = {//
            "landId": (function(){if(self.getPerNode()){
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
    debug(){//除虫
        var self = this;
        var plantData = {//
            "landId": (function(){if(self.getPerNode()){
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
            "landId": (function(){if(self.getPerNode()){
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
