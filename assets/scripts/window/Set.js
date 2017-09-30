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
        audioBtnLabel:{//声音开关
            default:null,
            type:cc.Label
        },
        //背景音乐开关
        bgMusicBtnLabel:{
            default:null,
            type:cc.Label
        },
        audio:{
            default:null,
            url:cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function () {

    },
    showThis(){
        this.audioBtnLabel.string = Global.openAudio?'关闭音效':'开启音效';
        this.root.active = true;
        this.root.runAction(Global.openAction);
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    confirmExit(){//确定退出
        cc.log('退出成功');
        cc.director.end()
    },
    exitGame(){//退出游戏
        this.showConDia('是否退出游戏?',this.confirmExit,function(){})
    },
    backLogin:function(){//返回登录
        if(Global.layer){
            Global.layer = null;
        }
        cc.director.loadScene("LogIn");
    },
    audioSet(){//开关声音
        Global.openAudio = !Global.openAudio;
        if(Global.openAudio){
            cc.audioEngine.playEffect(this.audio, false);
            this.showLittleTip('音效已开启');
        }else{
            this.showLittleTip('音效已关闭');
        }
        this.audioBtnLabel.string = Global.openAudio?'关闭音效':'开启音效';
    },
    //游戏背景音乐开关
    bgMusicSet(){
        Global.openBgMusic = !Global.openBgMusic;
        if(Global.openBgMusic){
            cc.audioEngine.play(cc.find('Game').getComponent('Game').bgMusic,true,1);
            this.showLittleTip('背景音乐已开启');
        }else{
            cc.audioEngine.stopAll();
            this.showLittleTip('背景音乐已关闭');
        }
        this.bgMusicBtnLabel.string = Global.openBgMusic?'关闭背景音乐':'开启背景音乐';
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
