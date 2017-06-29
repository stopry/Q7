//禁止触摸穿透
cc.Class({
    extends: cc.Component,

    properties: {
        touchTarget:{
            default:null,
            type:cc.Node
        }
    },
    // use this for initialization
    onLoad: function () {
        this.touchTarget.on('touchstart', function(event){
            event.stopPropagation();
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
