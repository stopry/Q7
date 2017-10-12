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
        //音效文字
        audioText:{
            default:null,
            type:cc.Sprite
        },
        audioTextClosePic:{
            default:null,
            type:cc.SpriteFrame
        },
        audioTextOpenPic:{
            default:null,
            type:cc.SpriteFrame
        },
        audioCloseIcon:{
            default:null,
            type:cc.Node
        },
        //背景音乐文字
        soundText:{
            default:null,
            type:cc.Sprite
        },
        soundTextClosePic:{
            default:null,
            type:cc.SpriteFrame
        },
        soundTextOpenPic:{
            default:null,
            type:cc.SpriteFrame
        },
        soundCloseIcon:{
            default:null,
            type:cc.Node
        },

        audio:{
            default:null,
            url:cc.AudioClip
        },
        //退出游戏按钮
        exitBtn:{
            default:null,
            type:cc.Node
        },
        //返回登录按钮
        backLoginBtn:{
            default:null,
            type:cc.Node
        },
        //返回登录按钮2
        backLoginBtnT:{
            default:null,
            type:cc.Node
        }
    },
    // use this for initialization
    onLoad: function () {

    },
    showThis(){
        //音效是否是打开状态
        if(Global.openAudio){
            this.audioText.spriteFrame = this.audioTextClosePic;
            this.audioCloseIcon.active = false;
        }else{
            this.audioText.spriteFrame = this.audioTextOpenPic;
            this.audioCloseIcon.active = true;
        }
        //背景音乐是否是打开状态
        if(Global.openBgMusic){
            this.soundText.spriteFrame = this.soundTextClosePic;
            this.soundCloseIcon.active = false;
        }else{
            this.soundText.spriteFrame = this.soundTextOpenPic;
            this.soundCloseIcon.active = true;
        }

        this.root.active = true;
        this.root.runAction(Global.openAction);

        if(!cc.sys.isNative){
            this.backLoginBtnT.active = true;
        }else{
            this.exitBtn.active = true;
            this.backLoginBtn.active = true;
        }
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    confirmExit(){//确定退出
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
        if(Global.openAudio){
            this.audioText.spriteFrame = this.audioTextClosePic;
            this.audioCloseIcon.active = false;
        }else{
            this.audioText.spriteFrame = this.audioTextOpenPic;
            this.audioCloseIcon.active = true;
        }
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
        if(Global.openBgMusic){
            this.soundText.spriteFrame = this.soundTextClosePic;
            this.soundCloseIcon.active = false;
        }else{
            this.soundText.spriteFrame = this.soundTextOpenPic;
            this.soundCloseIcon.active = true;
        }
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
