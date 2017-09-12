var Net = require('Net');
var Util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        root:{//根节点
            default:null,
            type:cc.Node
        },
        proItem:{//每个商品
            default:[],
            type:[cc.Node]
        }
    },
    // use this for initialization
    onLoad: function () {

    },
    //渲染市场
    redenrMarket(){

    },
    //显示自己动画
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
        this.redenrMarket();
    },
    //小提示
    showLittleTip(str){
        this.getComponent('LittleTip').setContent(str);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
