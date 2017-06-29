cc.Class({
    extends: cc.Component,

    properties: {
       clickAudio:{
           default:null,
           url:cc.AudioClip
       }
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
           var action = cc.scaleTo(0.05, 0.9, 0.9);
            //var action = cc.scaleTo(0.05, 1.1, 1.1);
            this.node.runAction(action);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var action = cc.scaleTo(0.05, 1, 1);
            //var action = cc.scaleTo(0.05, 1.1, 1.1);
            // 调用声音引擎播放声音
            cc.audioEngine.playEffect(this.clickAudio, false);
            this.node.runAction(action);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            var action = cc.scaleTo(0.05, 1, 1);
            //var action = cc.scaleTo(0.05, 1.1, 1.1);
            this.node.runAction(action);
        }, this);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
