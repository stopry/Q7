var Net = require('Net');
var util = require('Util');
cc.Class({
    extends:cc.Component,
    properties:{
        /*弹框遮罩层*/
        boxLayer:{
            default:null,
            type:cc.Node
        },
        /*升级治理遮罩层*/
        upDealLayer:{
            default:null,
            type:cc.Node
        },
        //根节点
        root:{
            default:null,
            type:cc.Node
        },
        //确认操作对话框
        conDia:{
            default:null,
            type:cc.Prefab
        },
        //弹框遮罩层
        alertLayer:{
            default:null,
            type:cc.Prefab
        },
        /*主场景*/
        //营业证详细信息
        licenseDetailBox:{
            default:null,
            type:cc.Node
        },
        //污染度进度条
        wrdPrg:{
            default:null,
            type:cc.ProgressBar
        },
        //污染度数值显示
        wrdNumText:{
            default:null,
            type:cc.Label
        },
        //排污量label
        pwlTxt:{
            default:null,
            type:cc.RichText
        },
        //产能label
        cnTxt:{
            default:null,
            type:cc.RichText
        },
        //已盈利
        yyl:{
            default:null,
            type:cc.RichText
        },
        //头部信息结束

        /*营业执照信息*/
        //法人代表label
        legalTxt:{
            default:null,
            type:cc.RichText
        },
        //工厂编号label
        facNumTxt:{
            default:null,
            type:cc.RichText
        },
        //营业范围label
        bniRngTxt:{
            default:null,
            type:cc.RichText
        },

        //工厂建筑
        facBud:{
            default:null,
            type:cc.Node
        },

        /*治理弹框*/
        //治理环境对话框
        dealEvnBox:{
            default:null,
            type:cc.Node
        },
        //污染度进度条
        ploPrg:{
            default:null,
            type:cc.ProgressBar
        },
        //污染度进度条数字
        ploNumText:{
            default:null,
            type:cc.Label
        },
        //绿能输入框
        greenIpt:{
            default:null,
            type:cc.EditBox
        },
        //绿能输入框Node节点
        greenIptNode:{
            default:null,
            type:cc.Node
        },
        //绿能储备
        greenAmt:{
            default:null,
            type:cc.Label
        },

        /*展开关闭头部底部按钮*/
        topBotToggleBtn:{
            default:null,
            type:cc.Node
        },
        //头部
        header:{
            default:null,
            type:cc.Node
        },
        //底部
        footer:{
            default:null,
            type:cc.Node
        },
    },
    onLoad(){
        //关闭加载动画
        cc.director.getScene().getChildByName('ReqAni').active = false;

        this.facId = cc.sys.localStorage.getItem('factoryId')||'none';
        //当前绿能数量
        this.greenCnt = 120;
        //头部底部展开状态
        this.showStatus = true;
        this.init();
    },
    init(){
        this.renderScene();

        // this.renderDealBox();
    },
    mockDatas(){
        let d = {};
        d.facInfo = {
            pl:1,//污染度-30%--总污染100
            plph:2,//排污量-2吨每小时
            uph:10,//产能-10金币/小时
            profit:1000,//累计盈利-金币
            license:{//营业执照
                legal:'五棵树',//法人代表
                num:'皖A151545312',//工厂编号
                range:'核能',//营业范围
                level:'9',//工厂等级
            },
            active: {//激活状态
                status: 0,//未激活
                condition: [//激活所需材料
                    {itemId: '1001', cnt: 10},
                    {itemId: '1003', cnt: 10}
                ],
            },
            upGradeDatas:{
                curLv:1,//当前等级
                condition: [//升级所需材料
                    {itemId: '1001', cnt: 10},
                    {itemId: '1002', cnt: 10}
                ],
            }
        };
        return d;
    },

    //显示营业执照
    showLicense(){
        this.boxLayer.active = true;
        this.setPosIndex(this.licenseDetailBox);
    },
    //关闭营业执照
    closeLicense(){
        this.boxLayer.active = false;
        this.licenseDetailBox.active = false;
    },
    /*界面渲染*/
    //主场景渲染
    renderScene(){
        this.getFactoryInfo(this.facId).then((res)=>{
            if(res){
                this.wrdPrg.progress = res.pl/res.max;//头部污染度进度条
                this.wrdNumText.string = res.pl+"/"+res.max;//进度条数值显示
                this.pwlTxt.string = "<outline color=#5D1A0A width=1>"+res.plph+"吨/每小时</outline>";//头部污染度
                this.cnTxt.string = "<outline color=#8A4B11 width=2>"+res.uph+"金币/每小时</outline>";//头部产能
                this.yyl.string = "<outline color=#8A4B11 width=2>"+100+"金币</outline>";//头部已盈利
                //营业执照信息
                if(this.getPerNode()){//法人信息
                    let name =  this.perNode.getComponent('PersistNode').userData.selfInfo.nickname;
                    this.legalTxt.string = "<outline color=#5D1A0A width=1>"+name+"</outline>";
                }
                this.facNumTxt.string = "<outline color=#5D1A0A width=1>"+res.no||'未激活'+"</outline>";//工厂编号
                this.bniRngTxt.string = "<outline color=#5D1A0A width=1>"+res.name+"</outline>";//营业范围
            }
        });
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    //办公室渲染
    /*renderOfficeRoom(){
        let of = this.mockDatas().facInfo;
        this.facLv_o.string = of.license.level;
        this.legal_o.string = of.license.legal;
        this.facNum_o.string = of.license.num;
        this.bniRang_o.string = of.license.range;
        this.wrdPrg_o.progress = of.pl/100;
        this.wrdNumText_o.string = of.pl+"/100";
        this.pwl_o.string = of.plph+"吨/小时";
        this.cn_o.strig = of.uph+"金币/每小时";
        this.profit_o.string = of.profit+"金币";
        this.activeCndt_o.removeAllChildren();
        for(let i = 0;i<of.active.condition.length;i++){
            if(i!=of.active.condition.length-1){
                let needItem = cc.instantiate(this.needBoxPre);
                needItem.getComponent('SetNeedItem').setItem(
                    parseInt(((of.active.condition[i].itemId).toString()).split('')[3])-1,//图片
                    "5/"+of.active.condition[i].cnt
                );
                let add = cc.instantiate(this.addPre);
                this.activeCndt_o.addChild(needItem);
                this.activeCndt_o.addChild(add);
            }else{
                let needItems = cc.instantiate(this.needBoxPre);
                needItems.getComponent('SetNeedItem').setItem(
                    parseInt(((of.active.condition[i].itemId).toString()).split('')[3])-1,//图片
                    "5/"+of.active.condition[i].cnt
                );
                this.activeCndt_o.addChild(needItems);
            }
        }
        //升级工厂和治理环境按钮可用状态设置
        this.upGradeBtn.interactable = !(parseInt(this.mockDatas().facInfo.license.level)>9);
        this.dealEnvBtn.interactable = !(this.mockDatas().facInfo.pl<=0);
    },*/
    //升级框渲染
    /*renderUpBox(){
        this.upCndt.removeAllChildren();
        for(var i = 0;i<5;i++){
            if(i!=4){
                var needItem = cc.instantiate(this.needBoxPre);
                var add = cc.instantiate(this.addPre);
                this.upCndt.addChild(needItem);
                this.upCndt.addChild(add);
            }else{
                var needItems = cc.instantiate(this.needBoxPre);
                this.upCndt.addChild(needItems);
            }
        }
    },*/
    //治理环境框渲染
    renderDealBox(){
        this.ploPrg.progress = datas.pl/100;
        this.greenAmt.string = this.greenCnt+"吨";
    },

    /*治理环境绿能数量操作*/
    //计算治理当前污染度所需要的绿能
    calcGrnOfDealEnv(){

    },
    //绿能数量改变回调
    onGrnChange(){
        let grnNum = this.greenIpt.string;
        this.ploPrg.progress = grnNum/100;
    },
    //减少绿能数量
    reduceGrnNum(){
        this.greenIpt.string--;
        this.onGrnChange();
    },
    //增加绿能数量
    addGrnNum(){
        this.greenIpt.string++;
        this.onGrnChange();
    },
    //添加最大数量绿能
    maxGrnNum(){
        this.greenIpt.string = this.greenCnt;
        this.onGrnChange();
    },
    //显示提示
    showLittleTip(str){
        this.getComponent('LittleTip').setContent(str);
    },
    /*弹窗控制*/
    //激活工厂
    activeFactory(){
        this.showConDia('确认激活工厂吗？',()=>{
            this.showLittleTip('激活成功');
        },()=>{});
    },
    //弹出确认对话框
    showConDia(msg,fn1,fn2){
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
    //弹窗位置层级设置
    setPosIndex(node){
        node.parent = this.root;
        node.setPosition(cc.v2(0,0));
        node.active = true;
        node.runAction(Global.openAction);
    },
    //关闭弹窗动画
    closeAni(node){
        var scaleTo = cc.scaleTo(0.1,1.1,1.1);
        var scaleTo2 = cc.scaleTo(0.1,0,0);
        var finished = cc.callFunc(function () {
            node.active = false;
        }, this);
        var action = cc.sequence(scaleTo,scaleTo2, finished);
        node.runAction(action);
    },

    //打开治理弹框
    openDealBox(){
        this.upDealLayer.active = true;
        this.setPosIndex(this.dealEvnBox);
    },
    //关闭治理弹框
    closeDealBox(){
        this.upDealLayer.active = false;
        this.closeAni(this.dealEvnBox);
    },
    //展开收起头部底部
    toggleTopBot(){
        this.showStatus = !this.showStatus;
        let rotate_0 = cc.rotateTo(0,0);
        let rotate_180 = cc.rotateTo(0,180);

        let fade_out = cc.fadeTo(0.5,0);
        let fade_out_2 = cc.fadeTo(0.5,0);
        let fade_in = cc.fadeTo(0.5,255);
        let fade_in_2 = cc.fadeTo(0.5,255);

        let movetopHide = cc.moveBy(0.5, 0, 152);//头部隐藏
        let movetopShow = cc.moveBy(0.5, 0, -152);//头部显示

        let movebotHide = cc.moveBy(0.5, 0, -87);//底部隐藏
        let movebotShow = cc.moveBy(0.5, 0, 87);//底部显示

        if(!this.showStatus) {
            this.topBotToggleBtn.runAction(rotate_0);
            this.header.runAction(cc.spawn(fade_out,movetopHide));
            this.footer.runAction(cc.spawn(fade_out_2,movebotHide));
        }else{
            this.topBotToggleBtn.runAction(rotate_180);
            this.header.runAction(cc.spawn(fade_in,movetopShow));
            this.footer.runAction(cc.spawn(fade_in_2,movebotShow));
        }
    },

    /*工厂接口*/
    //激活工厂
    //工厂id
    /*confirmActiveFactory(id){
      let pro = new Promise((resolve,reject)=>{
         Net.get('/api/game/factory/activate',1,{id:id},(data)=>{
             if(!data.success){
                 this.showLittleTip(data.msg);
                 reject(data.msg);
                 return;
             }else{
                 resolve(data.obj);
             }
         },(err)=>{
             reject(false);
         })
      });
      return pro;
    },*/
    //获取工厂
    //工厂id
    getFactoryInfo(id){
        let pro = new Promise((resolve,reject)=>{
            Net.get('/api/game/factory/getFactory',1,{id:id},(data)=>{
                if(!data.success){
                    this.showLittleTip(data.msg);
                    reject(data.msg);
                    return;
                }else{
                    resolve(data.obj);
                }
            },(err)=>{
                reject(false);
            })
        });
        return pro;
    },
    //治理工厂
    //工厂id 绿能数量num
    /*confirmGovernFactory(id,num){
        let pro = new Promise((resolve,reject)=>{
            Net.get('/api/game/factory/govern',1,{id:id,num:num},(data)=>{
                if(!data.success){
                    this.showLittleTip(data.msg);
                    reject(data.msg);
                    return;
                }else{
                    resolve(data.obj);
                }
            },(err)=>{
                reject(false);
            })
        });
        return pro;
    },*/
    //升级工厂
    //工厂id
    /*confirmUpgradeFactory(id){
        let pro = new Promise((resolve,reject)=>{
            Net.get('/api/game/factory/upgrade',1,{id:id},(data)=>{
                if(!data.success){
                    this.showLittleTip(data.msg);
                    reject(data.msg);
                    return;
                }else{
                    resolve(data.obj);
                }
            },(err)=>{
                reject(false);
            })
        });
        return pro;
    },*/
    //返回游戏场景
    backGame(){
        cc.director.loadScene("Game",()=>{//回调
            // cc.director.getScene().getChildByName('ReqAni').active = false;
        });
    },
    //组件销毁
    onDestroy(){

    },
});