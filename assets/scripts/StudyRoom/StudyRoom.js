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
            type:cc.Label
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
        }
    },
    // use this for initialization
    onLoad: function () {
        this.upBtn.on(cc.Node.EventType.TOUCH_END,function(){
            cc.log(this.upType);
            var msgStr = '确认升级种植大全吗!';
            if(this.upType==0){
                msgStr = '确认升级种植大全吗!';
            }else if(this.upType==1){
                msgStr = '确认升级林权证书吗!';
            }else if(this.upType==2){
                msgStr = '确认升级木材市场运营证吗!';
            }else if(this.upType==3){
                msgStr = '确认升级碳汇市场运营证吗!';
            }
            this.showConDia(msgStr,function(){
                this.showLittleTip('升级成功');
                this.renderUpAni(this.upType);
            }.bind(this),function(){
                this.showLittleTip('取消升级')
            }.bind(this));
        },this);
        this.addAuthClick();
    },
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
    changAuthType(authType){//切换证书类型
        if(authType==this._authType){
            return;
        }
        this._authType = authType;
        for(var i = 0;i<this.authBox.getChildren().length;i++){
            this.authBox.getChildren()[i].getComponent(cc.Sprite).spriteFrame = this.authBg[0];
        }
        this.authBox.getChildren()[this._authType].getComponent(cc.Sprite).spriteFrame = this.authBg[1];
        this.renderUpBox(this._authType);
    },
    renderUpBox(type){//显示升级框中内容
        this.oprBtnBox.active = true;
        this.renderUpAni(0);
        if(type==0){
            this.renderUpAni(1);
            this.boxTitle.string = '种植大全';
            this.boxDesc.string = '种植大全';
        }else if(type==1){
            this.boxTitle.string = '林权证书';
            this.boxDesc.string = '林权证书';
        }else if(type==2){
            this.boxTitle.string = '木材市场运营证';
            this.boxDesc.string = '木材市场运营证';
        }else if(type==3){
            this.boxTitle.string = '碳汇市场运营证';
            this.boxDesc.string = '碳汇市场运营证';
        }else if(type==4){
            this.boxTitle.string = '敬请期待';
            this.boxDesc.string = '敬请期待';
            this.oprBtnBox.active = false;
        }
    },
    renderUpAni(type){//显示升级动画框
        if(type==1){
            this.upAniBox.active = true;
            this.upAniBox.getChildByName('upAni').getComponent(cc.Animation).play();
        }else{
            this.upAniBox.getChildByName('upAni').getComponent(cc.Animation).stop();
            this.upAniBox.active = false;
        }
    },
    showThis(){//显示动画
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
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
