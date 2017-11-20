var Net = require('Net');
var Util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        //根节点
        root:{
            default:null,
            type:cc.Node
        },
        //工厂列表元素
        facItem:{
            default:[],
            type:[cc.Node]
        },
        //状态图片列表
        statusPic:{
            default:[],
            type:[cc.SpriteFrame]
        },
    },
    // use this for initialization
    onLoad(){
        this.facId = 1;
        this.getFactoryList(true);
    },
    onDestroy(){

    },
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
        this.getFactoryList(false);
    },
    //获取工厂列表
    getFactoryList(isbind){
        Net.get('/api/game/factory/list',1,null,(data)=>{
            if(!data.success){
                this.showLittleTip(data.msg);
                return;
            }
            let list = data.obj;
            for(let i = 0;i<list.length;i++){
                this.initFacListItem(this.facItem[i],list[i].id,list[i],isbind);
            }
        },(err)=>{})
    },
    //初始化工厂列表item
    initFacListItem(facNode,id,list,isbind){
        this.facId = id;

        //facNode.getChildByName('lv').getComponent(cc.RichText).string =  "<outline color=#5D1A0A width=1>"+list.version +"</outline>";//等级

        facNode.getChildByName('wrd_prg').getComponent(cc.ProgressBar).progress = list.pl/list.max;//污染度
        facNode.getChildByName('pwl').getComponent(cc.RichText).string = "<outline color=#5D1A0A width=1>"+list.plph+"吨/每小时</outline>";//排污量
        facNode.getChildByName('cn').getComponent(cc.RichText).string = "<outline color=#8A4B11 width=2>"+list.uph+"吨/每小时</outline>";//产能
        facNode.getChildByName('status').getComponent(cc.Sprite).SpriteFrame = this.statusPic[list.status];//状态

        //facNode.getChildByName('yyl').getComponent(cc.RichText).string = "<outline color=#8A4B11 width=2>"+list.name+"吨/每小时</outline>";//已盈利
        if(isbind){
            let self = this;
            facNode.on(cc.Node.EventType.TOUCH_END,function(){
                // if(list.status=='0'){
                //     self.showLittleTip('该工厂未激活');
                //     return;
                // }
                self.toFactory();
            }.bind(self),this);
        }
    },
    //去工厂
    //工厂id
    toFactory(){
        cc.sys.localStorage.setItem('factoryId',this.facId);

        cc.director.getScene().getChildByName('ReqAni').active = true;
        cc.director.loadScene("Factory",()=>{//回调
            // cc.director.getScene().getChildByName('ReqAni').active = false;
        });
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    // update: function (dt) {

    // },
});
// <outline color=#5D1A0A width=1>0.0吨/每小时</outline>  #AC0B0B
// <outline color=#8A4B11 width=2>0.0吨/每小时</outline>  #E8C60F