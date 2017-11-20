var util = require('Util');
var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        mapContent:{//大地图内容区域
            default:null,
            type:cc.Node
        },
        backLogin:{
            default:null,
            type:cc.Node
        },
        userPic:{//用户头像
            default:null,
            type:cc.Sprite
        },
        headerInfo:[cc.Label],//头部信息
        spriteList: {//用户图片列表
            default: [],
            type: [cc.SpriteFrame]
        },
        treeList:{//12个林场列表
            default:[],
            type:[cc.Node]
        },
        treePic:{//树木图片
            default:[],
            type:[cc.SpriteFrame]
        },
        landList:[cc.Node],//土地列表
        statusPic:{//状态图片
            default:[],
            type:[cc.SpriteFrame]
        },
        cerList:{//四个证书  种植技术-林权证-木材准入-碳汇准入
            default:[],
            type:[cc.Button]
        },
        //游戏背景音乐
        bgMusic:{
            default:null,
            url:cc.AudioClip
        },
        //下拉按钮
        dropBtn:{
            default:null,
            type:cc.Node
        },
        //证书box
        cerBox:{
            default:null,
            type:cc.Node
        },
        //设置头像框box
        dropMenu:{
            default:null,
            type:cc.Node
        },
        //引导常驻节点
        Guider:{
            default:null,
            type:cc.Node
        }
    },
    // use this for initialization
    onLoad: function () {
        //默认工厂id
        cc.director.setDisplayStats(false);
        //添加新手引导所需的常驻节点
        cc.game.addPersistRootNode(this.Guider);
        this.initGame();
        //cc.director.preloadScene("PlantDetail", function () {
        //    cc.info("PlantDetail scene preloaded");
        //});
        if(Global.openBgMusic){
            this.music = cc.audioEngine.play(this.bgMusic,true,1);
        }else{
            cc.audioEngine.stopAll();
        }
        this.isShowHeader();
        this.isOpenShop();
    },
    //去用户中心
    toUserCenter(){
        if(Global.tranActive.users=='0') return;
        let token = cc.sys.localStorage.getItem('token');
        token = encodeURI(token);
        cc.sys.openURL("http://wap.market.o2plan.cn/#/skipPage?token="+token+"&link=userCenter");
        // cc.sys.openURL("http://localhost:4200/#/skipPage?token="+token+"&link=userCenter");
    },
    //去交易市场行情首页
    toMarket(){
        if(Global.tranActive.transact=='0') return;
        let token = cc.sys.localStorage.getItem('token');
        token = encodeURI(token);
        cc.sys.openURL("http://wap.market.o2plan.cn/#/skipPage?token="+token+"&link=market");
        // cc.sys.openURL("http://localhost:4200/#/skipPage?token="+token+"&link=market");
    },
    //是否显示头部
    isShowHeader(){
        if(Global.isShowHeader){
            this.dropBtn.rotation = 0;
            this.dropMenu.opacity = 255;
            this.dropMenu.scaleY = 1;
            this.cerBox.rotation = 0;
        }else{
            //cc.log(8);
            this.dropBtn.rotation = 180;
            this.dropMenu.opacity = 0;
            this.dropMenu.scaleY = 0;
            this.cerBox.rotation = 90;
        }
    },
    //收起打开头部
    toggleHeader(){
        Global.isShowHeader = !Global.isShowHeader;
        let openActionBtn = cc.rotateTo(0.2,0);
        let openActionCer = cc.rotateTo(0.2,0);
        let openActionMune = cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 1, 1));
        //let openActionMune = cc.scaleTo(0.2, 1, 1);

        let closeActionBtn = cc.rotateTo(0.2,180);
        let closeActionCer = cc.rotateTo(0.2,90);
        let closeActionMune = cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 1, 0));
        //let closeActionMune = cc.scaleTo(0.2, 1, 0);

        if(Global.isShowHeader){
            this.dropBtn.runAction(openActionBtn);
            this.dropMenu.runAction(openActionMune);
            this.cerBox.runAction(openActionCer);
        }else{
            this.dropBtn.runAction(closeActionBtn);
            this.dropMenu.runAction(closeActionMune);
            this.cerBox.runAction(closeActionCer);
        }
    },
    //判断是否是从种植详情跳转过来的是则打开商店
    isOpenShop(){
      if(!Global.hasTreesProp||!Global.hasWatersProp||!Global.hasBugsProp||!Global.hasGrassProp){
          this.getComponent('GameWindow').openShop();
          Global.hasTreesProp = Global.hasWatersProp = Global.hasBugsProp = Global.hasGrassProp = true;
      };
    },
    onDestroy(){
        cc.audioEngine.stopAll();
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    setHeader(){//设置头部
        if(this.getPerNode()){
            //用户名
            this.headerInfo[0].string = this.perNode.getComponent('PersistNode').userData.selfInfo.nickname;
            //用户等级
            this.headerInfo[1].string = this.perNode.getComponent('PersistNode').userData.selfInfo.level||10;
            //用户钻石
            this.headerInfo[2].string = this.perNode.getComponent('PersistNode').userData.selfInfo.jewel||0;
            //用户金币
            this.headerInfo[3].string = this.perNode.getComponent('PersistNode').userData.selfInfo.money||0;
            //用户头像
            this.userPic.spriteFrame = this.spriteList[parseInt(this.perNode.getComponent('PersistNode').userData.selfInfo.pic)-1||0];
            /*证书信息*/
            //种植技术
            this.cerList[0].interactable = this.perNode.getComponent('PersistNode').userData.selfInfo.scientific.plantLev?true:false;
            //林权证
            this.cerList[1].interactable = this.perNode.getComponent('PersistNode').userData.selfInfo.scientific.certLev?true:false;
            //木材市场准入
            this.cerList[2].interactable = this.perNode.getComponent('PersistNode').userData.selfInfo.scientific.woodCa?true:false;
            //碳汇市场准入
            this.cerList[3].interactable = this.perNode.getComponent('PersistNode').userData.selfInfo.scientific.greenCa?true:false;
        };
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    initGame(){
        this.getComponent('UpdateUserInfo').refresh().then((res)=>{
            this.renderAllTree();
            this.setHeader();
            //所有种植详情的下一状态时间
            var nextStsTimeArr = util.getNextStsTimeFromArr(res.playerPlantingDetail);
            //cc.log("所有下一状态时间：",nextStsTimeArr);
            var nextStsTimeArrFilter = util.getAllThatThanParam(!1,nextStsTimeArr);
            var minNext = util.getMinFromArr(nextStsTimeArrFilter);
            //cc.log('最小下一状态时间：',minNext);
            //cc.log("现在时间：",new Date().getTime(),"下一状态时间",minNext)
            util.updateStatusByNextStatusTime(
                new Date().getTime(),
                minNext,
                this.initGame
            )
        });
    },
    renderAllTree(){//渲染整个林场
        if(this.getPerNode()){
            this.lands = this.getPerNode().getComponent('PersistNode').userData.selfInfo.lands;//土地列表
            this.playerPlantingDetail = this.getPerNode().getComponent('PersistNode').userData.selfInfo.playerPlantingDetail;//全部种植详情
        }
        for(var i = 0;i<this.treeList.length;i++){
            this.renderTree(
                this.landList[i],//当前土地
                this.treeList[i],//当前树林
                this.lands[i].status,//当前土地状态
                this.lands[i].id,//当前土地id
                this.lands[i].pdId//当前土地pdId-用来得到种植详情
            );
        }
    },
    renderTree(land,tree,status,id,pdId){//渲染单个林场——status->土地状态 id->土地id pdId->土地pdId
        if(status==0){//土地未开坑状态
            //不做任何显示
            tree.getChildByName('tree').active = false;
            tree.getChildByName('status').active = false;
        }else if(status==1){//闲置状态
            tree.getChildByName('tree').active = false;
            //显示闲置状态气泡
            tree.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[3];//闲置状态气泡
            tree.getChildByName('status').active = true;
        }else if(status==2){//土地为种植状态
            //首先通过pdId得到这块地的种植详情
            var _plantDetail = util.getCurPlantDetail(pdId,this.playerPlantingDetail);
            //得到这块地的treeId并转换为对用树苗图片索引
            var _treeId = parseInt((_plantDetail.treeId+'').split('')[3])-1;
            //cc.log(_treeId,'树木id');

            //显示种植的树木
            tree.getChildByName('tree').getComponent(cc.Sprite).spriteFrame = this.treePic[_treeId];
            tree.getChildByName('tree').active = true;
            /*显示当前状态*/
            //得到当前土地树木的状态
            var _treeStatus = _plantDetail.status; //0123  种植期 成长期 成熟期 死亡期
            //得到灾害状态 0123 无 虫 草 旱
            var _disaster = _plantDetail.disaster;
            //cutStatus 1砍伐中
            var cutStatus = _plantDetail.cutStatus;
            //如果有灾害状态
            if(_disaster!=0){
                tree.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[_disaster-1];
                //if(_disaster==1){
                //    tree.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[0];
                //}else if(_disaster==2){
                //    tree.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[1];
                //}else {
                //    tree.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[2];
                //}
            }else{//如果没有灾害状态
                if(_treeStatus<2){//树木没有成熟->显示成长
                    tree.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[5];
                }else{//树木已经成熟->显示可砍伐
                    tree.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[6];
                }
                //判断种植详情中的砍伐状态如果是1则显示砍伐中状态气泡
                //if(cutStatus==1){
                //    tree.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[7];
                //}
            }
            tree.getChildByName('status').active = true;
        }
        this.mapContent.on(cc.Node.EventType.TOUCH_END,function(touch){
            //判断点击范围是否在多边形范围内
            let location = touch.getLocation();
            let isContain = land.getComponent('CustomComponent').check(location);
            //cc.log(isContain);
            if(!isContain) return;//不在绘制的多边形范围内，直接return
            if(status==0){
                this.getComponent('LittleTip').setContent('该土地未开垦！');
                return;
            }
            if(this.getPerNode()){
                this.perNode.getComponent('PersistNode').userData.curLandId = id;//当前进入的土地id
                this.perNode.getComponent('PersistNode').userData.curPdId = pdId;//当前进入的pId
                //cc.log(
                //    this.perNode.getComponent('PersistNode').userData.curLandId,
                //    this.perNode.getComponent('PersistNode').userData.curPdId
                //);
            };
            this.getComponent('ReqAni').showReqAni();
            //场景跳转-进入种植详情
            cc.director.loadScene("PlantDetail",()=>{//回调
                cc.director.getScene().getChildByName('ReqAni').active = false;
            });
        },this);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
