//常驻节点挂载的脚本
cc.Class({
    extends: cc.Component,

    properties: {

        userData:{
            get: function () {
                return this._userData;
            },
            set: function (value) {
                this._userData = value;
            },
            type:cc.Object,
            tooltip: "常驻节点用于场景切换传参"
        },
    },

    // use this for initialization
    onLoad: function () {
        var a = {
            name:'xiaom',
            age:'12',
            city:'hefei',
            sex:'male'
        };
        this.userData = a;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
