cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {

    },
    showReqAni(){//显示加载遮罩
        this.reqNode = cc.director.getScene().getChildByName('ReqAni');
        if(this.reqNode){
            this.reqNode.active = true;
        }
        return this.reqNode;
    },
    hideReqAni(){//隐藏加载遮罩
        this.reqNode = cc.director.getScene().getChildByName('ReqAni');
        if(this.reqNode){
            this.reqNode.active = false;
        }
        return this.reqNode;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
