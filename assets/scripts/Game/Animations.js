var util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        windList:[cc.Node],//风动画
    },

    // use this for initialization
    onLoad: function () {
        this.playWindAni();
        this.interVal = null;
    },
    //播放风动画
    playWindAni(){
        //生成一个随机秒数
        var _time = util.getRandInt(2,5)*1000;
        //得到一个风动画的索引
        var _index = util.getRandInt(0,2);
        this.interVal = setInterval(()=>{
            _time = util.getRandInt(2,5)*1000;
            _index = util.getRandInt(0,2);
            this.windList[_index].getComponent(cc.Animation).play();
            this.windList[_index].getComponent(cc.Animation).on('play',function(){
                this.windList[_index].active = true;
            },this);
            this.windList[_index].getComponent(cc.Animation).on('finished',function(){
                this.windList[_index].active = false;
            },this);
        },_time);
        // this.schedule(function(){
        //     _time = util.getRandInt(2,5);
        //     _index = util.getRandInt(0,2);
        //     this.windList[_index].getComponent(cc.Animation).play();
        //     this.windList[_index].getComponent(cc.Animation).on('play',function(){
        //         this.windList[_index].active = true;
        //     },this);
        //     this.windList[_index].getComponent(cc.Animation).on('finished',function(){
        //         this.windList[_index].active = false;
        //     },this);
        // },_time);
    },
    onDestroy(){
        if(this.interVal){
            clearInterval(this.interVal);
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
});
