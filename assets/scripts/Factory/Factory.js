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
            type:cc.Label
        },
        //产能label
        cnTxt:{
            default:null,
            type:cc.Label
        },
        //法人代表label
        legalTxt:{
            default:null,
            type:cc.Label
        },
        //工厂编号label
        facNumTxt:{
            default:null,
            type:cc.Label
        },
        //营业范围label
        bniRngTxt:{
            default:null,
            type:cc.Label
        },
        //工厂等级lebel
        facLvTxt:{
            default:null,
            type:cc.Label
        },
        //工厂建筑
        facBud:{
            default:null,
            type:cc.Node
        },
        /*办公室弹窗*/
        //办公室
        officeRoom:{
            default:null,
            type:cc.Node
        },
        //等级
        facLv_o:{
            default:null,
            type:cc.Label
        },
        //法人
        legal_o:{
            default:null,
            type:cc.Label
        },
        //工厂编号
        facNum_o:{
            default:null,
            type:cc.Label
        },
        //营业范围
        bniRang_o:{
            default:null,
            type:cc.Node
        },
        //污染度
        wrdPrg_o:{
            default:null,
            type:cc.ProgressBar
        },
        //污染度数值
        wrdNumText_o:{
            default:null,
            type:cc.Label
        },
        //排污量
        pwl_o:{
            default:null,
            type:cc.Label
        },
        //产能
        cn_o:{
            default:null,
            type:cc.Label
        },
        //累计盈利
        profit_o:{
            default:null,
            type:cc.Label
        },
        //未激活状态BOX
        inactiveBox:{
            default:null,
            type:cc.Node
        },
        //激活状态BOX
        activeBox:{
            default:null,
            type:cc.Node
        },
        //激活条件列表容器
        activeCndt_o:{
            default:null,
            type:cc.Node
        },
        //生产状态内容文字描述
        statusCon_o:{
            default:null,
            type:cc.Label
        },
        //生产状态文字描述
        status_o:{
            default:null,
            type:cc.Label
        },
        /*升级弹窗*/
        //升级工厂对话框
        upGradeBox:{
            default:null,
            type:cc.Node
        },
        //等级描述
        lvDesc:{
            default:null,
            type:cc.Label,
            tooltip:'升级框等级描述'
        },
        //升级条件列表容器
        upCndt:{
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
        /*工厂升级和环境治理按钮*/
        //工厂升级按钮
        upGradeBtn:{
            default:null,
            type:cc.Button
        },
        //环境治理按钮
        dealEnvBtn:{
            default:null,
            type:cc.Button
        },
        /*条件资源预制*/
        needBoxPre:{//所需材料预制
            default:null,
            type:cc.Prefab
        },
        addPre:{//加号预制
            default:null,
            type:cc.Prefab
        },
    },
    onLoad(){
        //当前绿能数量
        this.greenCnt = 120;
        //营业执照详情展开状态
        this.licenseStatus = false;
        this.init();
    },
    init(){
        this.renderScene();
        this.renderOfficeRoom();
        this.renderUpBox();
        this.renderDealBox();
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
    //toggle营业执照详情
    licenseToggle(){
        this.licenseStatus = !this.licenseStatus;
        this.licenseDetailBox.active = this.licenseStatus;
    },
    hideLicenseDetail(){
        if(this.licenseStatus){
            this.licenseStatus = false;
            this.licenseDetailBox.active = this.licenseStatus;
        }
    },
    /*界面渲染*/
    //主场景渲染
    renderScene(){
        this.wrdPrg.progress = this.mockDatas().facInfo.pl/100;
        this.wrdNumText.string = this.mockDatas().facInfo.pl+"/100";
        this.pwlTxt.string = this.mockDatas().facInfo.plph+"吨/小时";
        this.cnTxt.string = this.mockDatas().facInfo.uph+"金币/每小时";
        let license = this.mockDatas().facInfo.license;
        this.legalTxt.string = license.legal;
        this.facNumTxt.string = license.num;
        this.bniRngTxt.string = license.range;
        this.facLvTxt.string = license.level;
    },
    //办公室渲染
    renderOfficeRoom(){
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
    },
    //升级框渲染
    renderUpBox(){
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
    },
    //治理环境框渲染
    renderDealBox(){
        let datas = this.mockDatas().facInfo;
        this.ploPrg.progress = datas.pl/100;
        this.greenAmt.string = this.greenCnt+"吨";
    },
    /*升级操作*/
    //确认升级工厂
    upGradeFactory(){

    },
    //确认治理环境
    dealEnvironment(){

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
    showLittleTip:function(str){
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
    //打开办公室
    openOffice(){
        this.boxLayer.active = true;
        this.setPosIndex(this.officeRoom);
    },
    //关闭办公室
    closeOffice(){
        this.boxLayer.active = false;
        this.closeAni(this.officeRoom);
    },
    //打开升级弹框
    openUpBox(){
        this.upDealLayer.active = true;
        this.setPosIndex(this.upGradeBox);
    },
    //关闭升级弹框
    closeUpBox(){
        this.upDealLayer.active = false;
        this.closeAni(this.upGradeBox);
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
    //组件销毁
    onDestroy(){

    },
});