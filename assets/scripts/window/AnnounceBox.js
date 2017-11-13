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
        //公告标题
        anoTitle:{
            default:null,
            type:cc.Label
        },
        //公告日期
        anoDate:{
            default:null,
            type:cc.Label
        },
        //公告内容
        anoCon:{
            default:null,
            type:cc.RichText
        },
        //上一页按钮
        preBtn:{
            default:null,
            type:cc.Node
        },
        //下一页按钮
        nextBtn:{
            default:null,
            type:cc.Node
        }
    }
    ,

    // use this for initialization
    onLoad: function () {
        //上一条id
        this.lastId = null;
        //下一条id
        this.nextId = null;
        //是否在请求中
        this.isLoading = false;
    },
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
        this.getLastNotice();
    },
    //解析公告内容
    reFacAnoCon(str){
        return str;
    },
    //得到最新公告
    getLastNotice(){
        this.isLoading = true;
        Net.get('/api/notice/lastNotice',1,null,function (data) {
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                let obj = data.obj;
                if(!obj){
                    this.anoTitle.string = '没有任何公告';
                    return;
                }
                this.anoTitle.string = obj.title;
                this.anoDate.string = Util.formatTimeForH5(obj.datetime)[0]+" "+Util.formatTimeForH5(obj.datetime)[1];
                this.anoCon.string = this.reFacAnoCon(obj.content);
                this.lastId = obj.lastId;
                this.nextId = obj.nextId;
            }
            this.isLoading = false;
        }.bind(this),function (err) {
            this.isLoading = false;
        }.bind(this))
    },
    //通过id得到公告
    getAnoById(id){
        this.isLoading = true;
        Net.get('/api/notice/get',1,{id:id},function (data) {
            if(!data.success){
                this.showLittleTip(data.msg);
            }else{
                let obj = data.obj;
                this.anoTitle.string = obj.title;
                this.anoDate.string = Util.formatTimeForH5(obj.datetime)[0]+" "+Util.formatTimeForH5(obj.datetime)[1];
                this.anoCon.string = this.reFacAnoCon(obj.content);
                this.lastId = obj.lastId;
                this.nextId = obj.nextId;
            }
            this.isLoading = false;
        }.bind(this),function (err) {
            this.isLoading = false;
        }.bind(this));
    },
    //得到上一条公告
    getPre(){
        if(this.isLoading) return;
        if(!this.lastId){
            this.showLittleTip('没有上一页了');
            return;
        }
        this.getAnoById(this.lastId);
    },
    //得到下一条公告
    getNext(){
        if(this.isLoading) return;
        if(!this.nextId){
            this.showLittleTip('没有下一页了');
            return;
        }
        this.getAnoById(this.nextId);
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
