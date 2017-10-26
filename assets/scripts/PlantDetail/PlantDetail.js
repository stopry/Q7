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
        woodPics:[cc.SpriteFrame],//木材推图片
        plane:{//飞机
            default:null,
            type:cc.Node
        },
        shed:{//喷洒物
            default:null,
            type:cc.Node
        },
        sprayList:[cc.Node],//地面水花列表
        //种植场景背景音乐
        bgMusic:{
            default:null,
            url:cc.AudioClip
        },
        //确认框资源start
        conDia:{//确认对话框
            default:null,
            type:cc.Prefab
        },
    },
    // use this for initialization
    onLoad: function () {
        //eruda.get('console').config.set('overrideConsole', false);//打印信息对应到js文件
        this.isLoading = false;//防重复提交
        this.greenPool = new cc.NodePool();
        this.greenEnergyArray = [];//存放绿能数组
        // 关闭fps
        cc.director.setDisplayStats(false);
        this.resetAni();
        this.walkAniCtr(1);
        this.playNormalAni(1);
        this.renderTree();//初始化林场
        this.closeSpray();//关闭水花
        //添加绿能
        this.addGreenToWood();
        if(Global.openBgMusic){
            this.music = cc.audioEngine.play(this.bgMusic, true, 1);
        }else{
            cc.audioEngine.stopAll();
        }
    },
    onDestroy(){
        cc.audioEngine.stopAll();
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    //渲染林场
    renderTree(){
        this.getComponent('UpdateUserInfo').refresh().then(function(data){
            //cc.log(JSON.stringify(data));
            if(this.getPerNode()){
                //得到当前土地的id
                this.curLandId = this.perNode.getComponent('PersistNode').userData.curLandId;
                //pdId随时会发生变化,每次更新通过土地id得到当前土地的pdId
                this.pdId
                    = this.perNode.getComponent('PersistNode').userData.curPdId
                    = util.getPdIdByLandId(this.curLandId,data.lands);
                //cc.log(this.pdId);
                this.treeDetails= this.perNode.getComponent('PersistNode').userData.selfInfo.playerPlantingDetail;//得到全部种植详情
                if(this.treeDetails.length<=0){//如果全部种植详情为空
                    this.initTree(this.stump);
                }else{//如果全部种植详情不为空
                    //查找当前种植详情
                    this.plantDetail = util.getCurPlantDetail(this.pdId,this.treeDetails);
                    if(!this.plantDetail){//没有种植详情
                        this.initTree(this.stump);
                    }else{//有种植详情
                        var nextStatusTime = this.plantDetail.nextStsTime||new Date().getTime();
                        util.updateStatusByNextStatusTime(
                            new Date().getTime(),
                            nextStatusTime,
                            this.renderTree
                        );
                        var type = (parseInt(this.plantDetail.treeId)-1000);//树的类型 123456
                        var status = this.plantDetail.status;//树的状态0-种植期 1-成长期 2-成熟期 3-死亡期
                        var disaster = this.plantDetail.disaster;//树的灾害类型 0-无 1-虫 2-草 3-干旱

                        if(status==3){//死亡期
                            this.initTree(this.stump);
                            return;
                        }
                        //显示砍伐动画->如果有砍伐状态
                        if(this.plantDetail.cutStatus!=null){
                            this.showStage(this.plantDetail.cutStatus);
                        }
                        //根据树的类型显示树的ui
                        if(type==1&&disaster==0){
                            this.initTree(this.tree_1[status])
                        }else if(type==1&&disaster==1){
                            this.initTree(this.tree_1[3])
                        }else if(type==1&&disaster==2){
                            this.initTree(this.tree_1[5])
                        }else if(type==1&&disaster==3){
                            this.initTree(this.tree_1[4])
                        }

                        if(type==2&&disaster==0){
                            this.initTree(this.tree_2[status])
                        }else if(type==2&&disaster==1){
                            this.initTree(this.tree_2[3])
                        }else if(type==2&&disaster==2){
                            this.initTree(this.tree_2[5])
                        }else if(type==2&&disaster==3){
                            this.initTree(this.tree_2[4])
                        }

                        if(type==3&&disaster==0){
                            this.initTree(this.tree_3[status])
                        }else if(type==3&&disaster==1){
                            this.initTree(this.tree_3[3])
                        }else if(type==3&&disaster==2){
                            this.initTree(this.tree_3[5])
                        }else if(type==3&&disaster==3){
                            this.initTree(this.tree_3[4])
                        }

                        if(type==4&&disaster==0){
                            this.initTree(this.tree_4[status])
                        }else if(type==4&&disaster==1){
                            this.initTree(this.tree_4[3])
                        }else if(type==4&&disaster==2){
                            this.initTree(this.tree_4[5])
                        }else if(type==4&&disaster==3){
                            this.initTree(this.tree_4[4])
                        }

                        if(type==5&&disaster==0){
                            this.initTree(this.tree_5[status])
                        }else if(type==5&&disaster==1){
                            this.initTree(this.tree_5[3])
                        }else if(type==5&&disaster==2){
                            this.initTree(this.tree_5[5])
                        }else if(type==5&&disaster==3){
                            this.initTree(this.tree_5[4])
                        }

                        if(type==6&&disaster==0){
                            this.initTree(this.tree_6[status])
                        }else if(type==6&&disaster==1){
                            this.initTree(this.tree_6[3])
                        }else if(type==6&&disaster==2){
                            this.initTree(this.tree_6[5])
                        }else if(type==6&&disaster==3){
                            this.initTree(this.tree_6[4])
                        }
                    }
                }
            }
        }.bind(this));
    },
    initTree(_sprite){
        for(let i = 0;i<this.trees.length;i++){
            (this.trees[i].getComponent(cc.Sprite)).spriteFrame = _sprite;
        }
    },
    //添加绿能
    addGreenToWood(){
        //初始化绿能
        if(this.getPerNode()){
            var greenList = this.perNode.getComponent('PersistNode').userData.selfInfo.greenEnergies;
            if(greenList.length>=0){
                for(let l = 0;l<greenList.length;l++){
                    this.createGreenEnergy(
                        greenList[l].status,//状态
                        //1508469000000,//成熟倒计时
                        greenList[l].nextGeTime,//成熟倒计时
                        this.treeBox.getPosition(),//收取时位置
                        1,
                        greenList[l].createTime.id
                    );
                }
            }
        }
    },
    //创建绿能
    createGreenEnergy(status,countDown,treeBoxPos,type,id){//创建绿能
        var greenEne = null;
        this.greenEnergyArray = [];
        if(this.greenPool.size()>0){
            greenEne = this.greenPool.get();
        }else{
            greenEne = cc.instantiate(this.energyPre);
        }
        greenEne.parent = cc.find('Canvas');
        //状态 倒计时 树木容器的位置 类型(好友的0，我的1) id(绿能id)
        greenEne.getComponent('GreenEnergy').initGreenEnergy(status,countDown,treeBoxPos,type,id);
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
    closeSpray(){//关闭水花
        for(var k = 0;k<this.sprayList.length;k++){
            this.sprayList[k].active = false;
        }
    },
    playSpray(){//播放水花
        for(let i = 0;i<this.sprayList.length;i++){
            this.scheduleOnce(function(){
                this.sprayList[i].active = true;
            },i*0.4);
        }
        this.scheduleOnce(function(){this.closeSpray()},15*0.4);
    },
    resetPlane(){//重置飞机
        this.plane.getComponent(cc.Animation).stop();
        this.plane.active = false;
        this.plantBtn.interactable = true;
        this.plantBtn.node.color = cc.Color.WHITE;
        //播种，浇水，除虫害，除草害 之后会重置飞机动画，在此之后会重新渲染林场
        this.renderTree();
    },
    playPlane(type){//播放飞机type:123 除虫 除草 浇水
        this.plantBtn.interactable = false ;
        this.plantBtn.node.color = cc.Color.GRAY;
        this.plane.active = true;
        this.plane.getComponent(cc.Animation).play();
        if(type==1){//除虫
            this.playShed('planeBug');
            this.plane.getComponent(cc.Animation).on('finished',function(){
                this.resetPlane();
                this.showLittleTip('除虫成功');
            },this);
        }else if(type==2){//除草
            this.playShed('planeGrass');
            this.plane.getComponent(cc.Animation).on('finished',function(){
                this.resetPlane();
                this.showLittleTip('除草成功');
            },this);
        }else{//浇水
            this.playShed('planeWater');
            this.playSpray();//水花
            this.plane.getComponent(cc.Animation).on('finished',function(){
                this.resetPlane();
            },this);
        }
    },
    playShed(aniName){//播放喷洒
        this.shed.getComponent(cc.Animation).play(aniName);
    },
    showStage(stage){//根据树的生长阶段显示画面
        //cutStatus->砍伐状态 0 1 2 未砍伐 砍伐中 砍伐结束
        switch (stage){
            case 0:
                //cc.log(0);//未砍伐
                this.resetAni();
                this.playNormalAni();
                this.walkAniCtr(1);
                break;
            case 1:
                //cc.log(1);//砍伐中
                this.resetAni();
                this.cutAniCtr(1);
                this.liftAniCtr(1);
                break;
            case 2:
                //cc.log(2);//砍伐结束
                this.resetAni();
                this.playNormalAni();
                this.walkAniCtr(1);
                break;
            default:
                //cc.log(null);
        }
    },
    //播放正常状态种植场景动画
    playNormalAni(){
        this.digAni[0].active = true;
        this.digAni[0].getComponent(cc.Animation).play();
        this.waterAni[2].active = true;
        this.waterAni[2].getComponent(cc.Animation).play();
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
        },20000);
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
        if(this.isLoading) return;
        this.isLoading = true;
        var self = this;
        var plantData = {//
            "landId": (function(){if(self.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curLandId;
            }})()||0
        };
        Net.post('/api/game/cut',1,plantData,function(data){
            this.isLoading = false;
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.resetAni();
                this.cutAniCtr(1);
                this.liftAniCtr(1);
                this.renderTree();
                //this.showLittleTip('收取成功');
            }
        }.bind(this),function(){
            this.isLoading = false;
        }.bind(this));
    },
    plant(treeId){//种植
        if(this.isLoading) return;
        this.isLoading = true;
        var self = this;
        var plantData = {//种植提交数据
            "landId": (function(){if(self.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curLandId;
            }})()||0,
            "treeId": treeId
        };
        Net.post('/api/game/plant',1,plantData,function(data){
            this.isLoading = false;
            if(!data.success){
                let isHasTree = '种植该土地需要'.indexOf(data.msg)!=-1;
                if(isHasTree){
                    Global.hasTreesProp = false;
                    this.toShop(data.msg+',是否去商店购买？');
                    return;
                }
                this.showLittleTip(data.msg);
            }else{
                this.playPlane(3);
                this.resetAni();
                this.digAniCtr(1);
                this.scheduleOnce(function(){
                    this.showLittleTip('播种成功');
                },5);
                Global.selTreeBox.getComponent('CloseWindow').close(event,1);//播种成功后关闭选择种子弹出层
            }
        }.bind(this),function(data){
            this.isLoading = false;
            this.showLittleTip('网络错误');
        }.bind(this));
    },
    water(){//浇水
        if(this.isLoading) return;
        this.isLoading = true;
        var self = this;
        var plantData = {//
            "landId": (function(){if(self.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curLandId;
            }})()||0,
        };
        Net.post('/api/game/water',1,plantData,function(data){
            this.isLoading = false;
            if(!data.success){
                this.showLittleTip(data.msg);
                if(data.msg=='玩家没有该物品'){
                    Global.hasWatersProp = false;
                    this.toShop('你还没有甘露，是否去商店购买？')
                }
            }else{
                this.playPlane(3);
                this.resetAni();
                this.waterAniCtr(1);
                this.scheduleOnce(function(){
                    this.showLittleTip('浇水成功');
                },5);
            }
        }.bind(this),function(){
            this.isLoading = false;
            this.showLittleTip('网络错误');
        }.bind(this));
    },
    debug(){//除虫
        if(this.isLoading) return;
        this.isLoading = true;
        var self = this;
        var plantData = {//
            "landId": (function(){if(self.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curLandId;
            }})()||0
        };
        Net.post('/api/game/debug',1,plantData,function(data){
            this.isLoading = false;
            if(!data.success){
                this.showLittleTip(data.msg);
                if(data.msg=='玩家没有该物品'){
                    Global.hasBugsProp = false;
                    this.toShop('你还没有除虫剂，是否去商店购买？')
                }
            }else{
                this.playPlane(1);
            }
        }.bind(this),function(){
            this.isLoading = false;
            this.showLittleTip('网络错误');
        }.bind(this));
    },
    grass(){//除草
        if(this.isLoading) return;
        this.isLoading = true;
        var self = this;
        var plantData = {//
            "landId": (function(){if(self.getPerNode()){
                return self.perNode.getComponent('PersistNode').userData.curLandId;
            }})()||0
        };
        Net.post('/api/game/grass',1,plantData,function(data){
            this.isLoading = false;
            if(!data.success){
                this.showLittleTip(data.msg);
                if(data.msg=='玩家没有该物品'){
                    Global.hasGrassProp = false;
                    this.toShop('你还没有除草剂，是否去商店购买？')
                }
            }else{
                this.playPlane(2);
            }
        }.bind(this),function(){
            this.isLoading = false;
            this.showLittleTip('网络错误');
        }.bind(this));
    },
    //跳转回主场景商店
    toShop(titile){
        this.showConDia(titile,()=>{
            cc.director.loadScene("Game",function(){//回调

            }.bind(this));
        },()=>{

        })
    },
    showConDia(msg,fn1,fn2){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = this.root;
        Global.conLayer.active = true;

        var dia = cc.instantiate(this.conDia);
        dia.parent = this.root;
        dia.getComponent('ConfirmDia').setBoxFun(msg,fn1,fn2);
        dia.getComponent('ConfirmDia').showThis();
    },
    pick(){//收取绿能
        if(this.isLoading) return;
        this.isLoading = true;
        var self = this;
        var plantData = {//
            "greenId": 1
        };
        Net.post('/api/game/pick',1,plantData,function(data){
            this.isLoading = false;
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                this.showLittleTip('收取成功');
            }
        }.bind(this),function(){
            this.isLoading = false;
        }.bind(this));
    },
    back(){//返回主游戏界面
        cc.director.loadScene("Game",function(){//回调
            clearInterval(this.interVal);
        }.bind(this));
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
