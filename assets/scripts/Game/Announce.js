cc.Class({
    extends: cc.Component,

    properties: {
        announce:{//公告牌
            default:null,
            type:cc.Node
        },
        shortAnnoWrap:{//屏幕滚动短公告的box
            default:null,
            type:cc.Node
        },
        shortAnno:{//屏幕滚动短公告
            default:null,
            type:cc.Node
        }
    },
    // use this for initialization
    onLoad: function () {
        this.msg = '这有一条短公告'
        //this.AnoAni(1);
        this.getShortAnno();
        this.schedule(()=>{
            this.getShortAnno();
        },30);
    },
    //获取短公告
    getShortAnno(){
        this.shortAnnoWrap.active = true;
        var _wrapWidth = this.shortAnnoWrap.width;//短消息外框的宽度
        this.msg +="1";
        this.shortAnno.getComponent(cc.Label).string = this.msg;
        var _width = this.shortAnno.width;//得到消息框Label的宽度
        //设置Label的位置在box的最右侧（隐藏Label）
        var _shortAnoPos = _wrapWidth/2+_width/2;
        this.shortAnno.x = _shortAnoPos;
        //设置到最左侧的位置
        var _endPos = -_shortAnoPos;
        //根据消息内容长度设置从最右侧走到最左侧所需要的时间
        var _time = _width*0.02;
        //回调
        var finished = cc.callFunc(function () {
            this.shortAnnoWrap.active = false;
        }, this);
        //设置Label运动action
        var _action = cc.sequence(
            cc.moveTo(_time,cc.p(_endPos,0)),
            cc.moveTo(0,cc.p(_endPos,0)),
            finished
        );
        //执行动作
        this.shortAnno.runAction(_action);
        //短公告滚动完隐藏box
        //this.scheduleOnce(()=>{
        //    this.shortAnnoWrap.active = false;
        //},_time);
    },
    AnoAni(_bool){//公告牌动画 true播放 false停止
        var _bool = _bool||false;
        if(_bool){
            this.announce.getComponent(cc.Animation).play('announce');
        }else{
            this.announce.getComponent(cc.Animation).stop('announce');
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
