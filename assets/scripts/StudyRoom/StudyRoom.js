var Net = require('Net');
var util = require('Util');
cc.Class({
    extends: cc.Component,
    properties: {
        //确认框资源start
        conDia:{//确认对话框
            default:null,
            type:cc.Prefab
        },
        root:{//根节点
            default:null,
            type:cc.Node
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        //确认框资源end
        littleTip:{//小提示
            default:null,
            type:cc.Prefab
        },
        studyRoom:{//科研所框
            default:null,
            type:cc.Node
        },
        upBtn:{//升级按钮
            default:null,
            type:cc.Node
        },
        upType:{//升级的类型-默认为种植大全
            default:0,
            type:cc.Integer
        },
        authBox:{//证书容器
            default:null,
            type:cc.Node
        },
        authBg:{//证书背景图用来高亮显示
            default:[],
            type:[cc.SpriteFrame]
        },
        boxTitle:{//介绍区域标题
            default:null,
            type:cc.RichText
        },
        boxDesc:{//介绍区域文字介绍
            default:null,
            type:cc.Label
        },
        oprBtnBox:{//升级条件和按钮框
            default:null,
            type:cc.Node
        },
        upAniBox:{//升级动画框
            default:null,
            type:cc.Node
        },
        needBoxPre:{//所需材料预制
            default:null,
            type:cc.Prefab
        },
        addPre:{//加号预制
            default:null,
            type:cc.Prefab
        },
        needMerBox:{//所需材料box框
            default:null,
            type:cc.Node
        },
        progress:{
            default:null,
            type:cc.ProgressBar
        },//进度条
        picAni:{//pic动画
            default:null,
            type:cc.Node
        },
        picAniMaxDis:320,//pic动画x最大距离
    },
    // use this for initialization
    onLoad: function () {
        this.startTime = null;//证书升级开始时间
        this.endTime = null;//证书升级结束时间
        //树木列表
        this.treeNameList = [
            "柳树",
            "松树",
            "槐树",
            "梧桐树",
            "杉树",
            "银杏树"
        ];
        /*弹出确认升级框*/
        this.upBtn.on(cc.Node.EventType.TOUCH_END,function(){
            //cc.log(this.upType);
            var msgStr = '确认升级种植技术吗!';
            if(this.upType==0){
                msgStr = '确认升级种植技术吗!';
            }else if(this.upType==1){
                msgStr = '确认升级林权证书吗!';
            }else if(this.upType==2){
                msgStr = '确认升级木材市场准入证吗!';
            }else if(this.upType==3){
                msgStr = '确认升级碳汇市场准入证吗!';
            }
            this.showConDia(msgStr,function(){
                switch (this.upType){
                    case 0:
                        this.upPlantTec().then((res)=>{
                            this.showLittleTip('成功，正在升级中！')
                            this.renderUpAni(this.upType);
                        });
                        break;
                    case 1:
                        this.upWoodCer().then((res)=>{
                            this.showLittleTip('成功，正在升级中！');
                            this.renderUpAni(this.upType);
                            //刷新常驻节点及头部信息
                            cc.find('Game').getComponent('UpdateUserInfo').refresh(1)
                        });
                        break;
                    case 2:
                        this.activeWoodMar().then((res)=>{
                            this.showLittleTip('成功，正在激活中！');
                            this.renderUpAni(this.upType);
                        });
                        break;
                    case 3:
                        this.activeTanMar().then((res)=>{
                            this.showLittleTip('成功，正在激活中！');
                            this.renderUpAni(this.upType);
                        });
                        break;
                }
            }.bind(this),function(){
                this.showLittleTip('取消升级')
            }.bind(this));
        },this);
        /*弹出确认升级框*/
        this.renderUpBox(0);//初始显示种植技术信息
        //为每个证书添加点击事件
        this.addAuthClick();
    },
    //为每个证书添加点击事件
    addAuthClick(){
        var self = this;
        ;[].forEach.call(this.authBox.getChildren(),function(item){
            item.on(cc.Node.EventType.TOUCH_END,function(){
                let index = parseInt(util.splitStr(item.name));
                self.upType = index;
                self.changAuthType(index);
            },self)
        });
    },
    //切换显示证书类型
    changAuthType(authType){
        if(authType==this._authType){
            return;
        }
        this._authType = authType;
        /*高亮显示选择框*/
        for(var i = 0;i<this.authBox.getChildren().length;i++){
            this.authBox.getChildren()[i].getComponent(cc.Sprite).spriteFrame = this.authBg[0];
        }
        this.authBox.getChildren()[this._authType].getComponent(cc.Sprite).spriteFrame = this.authBg[1];
        /*高亮显示选中框*/
        this.renderUpBox(this._authType);
    },
    //显示升级框中内容
    renderUpBox(type){
        this.renderUpAni(0);
        if(type==0){//种植技术
            this.boxTitle.string = "<color=#ffd07e><outline color=#562B04 width=2>种植技术</outline></color>";
            this.getPlantTec().then((res)=>{
                //种植证书状态正常 1->正常 2->升级中
                if(res.sc.plantStatus==1){
                    var string = '';
                    string+='当前种植技术等级为'+res.sc.plantLev;
                    string+='，升级后种植等级变为'+res.pa.level;
                    string+='，升级后可种植树木为：';
                    var _temp1 = '';
                    for(var i = 0;i<res.pa.tree.length;i++){
                        var _tree = this.treeNameList[parseInt(((res.pa.tree[i]).toString()).split('')[3])-1];
                        _temp1+=_tree+'、';
                    }
                    _temp1 = _temp1.substring(0,_temp1.length-1);
                    string+=_temp1;
                    this.boxDesc.string = string;
                }else if(res.sc.plantStatus==2){//证书升级中
                    this.startTime = res.sc.plantStart;
                    this.endTime = res.sc.plantEnd;
                    this.renderUpAni(1,this.startTime,this.endTime);
                }
                this.renderNeedMerBox(res.pa.wood);
                this.oprBtnBox.active = true;
            });
        }else if(type==1){//林权证
            this.boxTitle.string = "<color=#ffd07e><outline color=#562B04 width=2>林权证书</outline></color>";
            this.getWoodCer().then((res)=>{
                //林权证书状态正常 1->正常 2->升级中
                if(res.sc.certStatus==1){//林权证书正常状态
                    var _string = '';
                    _string+='当前林权证等级为'+res.sc.certLev;
                    _string+='，升级后林权证等级为'+res.ca.level;
                    _string+='，升级后可种植林场数量为'+res.ca.count;
                    this.boxDesc.string = _string;
                }else if(res.sc.cerStatus==2){//证书升级中
                    this.startTime = res.sc.certStart;
                    this.endTime = res.sc.certEnd;
                    this.renderUpAni(1,this.startTime,this.endTime);
                }
                let tmpArr = [{wood_id: 7007, wood_cnt: res.ca.jewel}];
                this.renderNeedMerBox(tmpArr);
                this.oprBtnBox.active = true;
            });
            this.boxDesc.string = '林权证书';
        }else if(type==2){//木材市场准入证
            this.boxTitle.string = "<color=#ffd07e><outline color=#562B04 width=2>木材市场准入证</outline></color>";
            this.getWoodMarket().then((res)=>{
                //status 0->未激活  1->已激活
                if(res.status==0){//未激活
                    this.boxDesc.string = '木材市场准入证（未激活），激活后可以进行木材交易';
                    this.oprBtnBox.active = true;
                }else if(res.status==1){//已激活
                    this.boxDesc.string = '木材市场准入证（已激活），可以正常进行木材交易';
                    this.oprBtnBox.active = false;
                }
                this.renderNeedMerBox([]);
            });
        }else if(type==3){//碳汇市场准入证
            this.boxTitle.string = "<color=#ffd07e><outline color=#562B04 width=2>碳汇市场准入证</outline></color>";
            this.getTanMarket().then((res)=>{
                //status 0->未激活  1->已激活
                if(res.status==0){//未激活
                    this.boxDesc.string = '碳汇市场准入证（未激活），收集绿能达到'+res.ca.green_cnt+'可以激活此证，激活后可以进行碳汇交易';
                    this.oprBtnBox.active = true;
                }else if(res.status==1){//已激活
                    this.boxDesc.string = '碳汇市场准入证（已激活），可以正常进行碳汇交易';
                    this.oprBtnBox.active = false;
                }
                this.renderNeedMerBox([]);
            })
        }else if(type==4){//敬请期待部分
            this.boxTitle.string = "<color=#ffd07e><outline color=#562B04 width=2>敬请期待</outline></color>";
            this.boxDesc.string = '敬请期待!';
            this.oprBtnBox.active = false;
        }
    },
    //显示升级动画框
    renderUpAni(type,startTime,endTime){
        startTime = startTime||0;
        endTime = endTime||0;
        var _now = new Date().getTime();//得到现在时间戳
        var proVal = (_now-startTime)/(endTime-startTime);//进度值
        if(type==1){
            this.upAniBox.active = true;
            this.progress.progress = proVal;
            this.picAni.x = this.picAniMaxDis*proVal;
            this.upAniBox.getChildByName('upAni').getComponent(cc.Animation).play();
        }else{
            this.upAniBox.getChildByName('upAni').getComponent(cc.Animation).stop();
            this.upAniBox.active = false;
        }
    },
    //动态更新动画进度
    updateUpAni(){
        this.interValProcess = setInterval(()=>{
            var _now = new Date().getTime();//得到现在时间戳
            var proVal = (_now-this.startTime)/(this.endTime-this.startTime);//进度值
            this.progress.progress = proVal;
            this.picAni.x = this.picAniMaxDis*proVal;
            if(proVal>=1){
                this.endUpdateUpAni();
            }
        },1000);
    },
    endUpdateUpAni(){//停止更新动画
        clearInterval(this.interValProcess);
        this.renderUpBox(this.upType);
    },
    //获取林权证信息
    getWoodCer(){
        var promise = new Promise((resolve,reject)=>{
            Net.get('/api/game/scientific/cert',1,null,(data)=>{
                if(!data.success){
                    this.showLittleTip(data.msg);
                    return;
                }else{
                    resolve(data.obj);
                }
            },(err)=>{
                reject(err);
            })
        });
        return promise;
    },
    //获取种植技术信息
    getPlantTec(){
        var promise = new Promise((resolve,reject)=>{
            Net.get('/api/game/scientific/plant',1,null,(data)=>{
                if(!data.success){
                    this.showLittleTip(data.msg);
                    return;
                }else{
                    resolve(data.obj);
                }
            },(err)=>{
                reject(err);
            })
        });
        return promise;
    },
    //获取木材市场准入证信息
    getWoodMarket(){
        var promise = new Promise((resolve,reject)=>{
            Net.get('/api/game/scientific/woodca',1,null,(data)=>{
                if(!data.success){
                    this.showLittleTip(data.msg);
                    return;
                }else{
                    resolve(data.obj);
                }
            },(err)=>{
                reject(err);
            })
        });
        return promise;
    },
    //获取碳汇市场准入证信息
    getTanMarket(){
        var promise = new Promise((resolve,reject)=>{
            Net.get('/api/game/scientific/greenca',1,null,(data)=>{
                if(!data.success){
                    this.showLittleTip(data.msg);
                    return;
                }else{
                    resolve(data.obj);
                }
            },(err)=>{
                reject(err);
            })
        });
        return promise;
    },
    //升级种植技术
    upPlantTec(){
        return new Promise((resolve,reject)=>{
            Net.get('/api/game/scientific/plantUp',1,null,(res)=>{
                if(!res.success){
                    this.showLittleTip(res.msg);
                }else{
                    resolve(res.obj);
                }
            },(err)=>{
                reject(err);
            })
        });
    },
    //升级林权证书
    upWoodCer(){
        return new Promise((resolve,reject)=>{
            Net.get('/api/game/scientific/certUp',1,null,(res)=>{
                if(!res.success){
                    this.showLittleTip(res.msg);
                }else{
                    resolve(res.obj);
                }
            },(err)=>{
                reject(err);
            })
        });
    },
    //激活木材市场准入证
    activeWoodMar(){
        return new Promise((resolve,reject)=>{
            Net.get('/api/game/scientific/woodActivate',1,null,(res)=>{
                if(!res.success){
                    this.showLittleTip(res.msg);
                }else{
                    resolve(res.obj);
                }
            },(err)=>{
                reject(err);
            })
        });
    },
    //激活碳汇市场准入证
    activeTanMar(){
        return new Promise((resolve,reject)=>{
            Net.get('/api/game/scientific/greenActivate',1,null,(res)=>{
                if(!res.success){
                    this.showLittleTip(res.msg);
                }else{
                    resolve(res.obj);
                }
            },(err)=>{
                reject(err);
            })
        });
    },
    //渲染升级所需材料框中的内容
    renderNeedMerBox(arr){
        arr = arr||[];
        this.needMerBox.removeAllChildren();//移除所有子节点
        if(arr.length<=0) return;
        //通过常驻节点得到玩家拥有的钻石
        if(this.getPerNode()){
            var myJewel = this.perNode.getComponent('PersistNode').userData.selfInfo.jewel
        }
        //得到仓库中所有木材
        Net.get('/api/game/getPlayerItemList',1,{type:2},(res)=>{
            if(!res.success){
                this.showLittleTip(res.msg);
            }else{
                var wooList = res.obj;
                for(let i = 0;i<arr.length;i++){
                    if(i!=arr.length-1){
                        var needItem = cc.instantiate(this.needBoxPre);
                        var add = cc.instantiate(this.addPre);

                        needItem.getComponent('SetNeedItem').setItem(
                            parseInt(((arr[i].wood_id).toString()).split('')[3])-1,//图片
                            arr[i]==7007?(myJewel+'/'+arr[i].wood_cnt):(util.getCntByWoodId(wooList,arr[i].wood_id)+'/'+arr[i].wood_cnt)
                        );
                        this.needMerBox.addChild(needItem);
                        this.needMerBox.addChild(add);
                    }else{
                        var needItems = cc.instantiate(this.needBoxPre);
                        needItems.getComponent('SetNeedItem').setItem(
                            parseInt(((arr[i].wood_id).toString()).split('')[3])-1,//图片
                            arr[i]==7007?(myJewel+'/'+arr[i].wood_cnt):(util.getCntByWoodId(wooList,arr[i].wood_id)+'/'+arr[i].wood_cnt)
                        );
                        this.needMerBox.addChild(needItems);
                    }
                }
            }
        },(err)=>{
            this.showLittleTip('网络错误');
        });
    },
    showThis(){//显示研究院
        this.studyRoom.active = true;
        this.studyRoom.runAction(Global.openAction);
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
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
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
