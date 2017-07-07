//选择一个item
var util = require('Util');
var creatRole = require('creatRole');//引入创建角色
cc.Class({
    extends: cc.Component,

    properties: {
        item:[cc.Node],
        itemBorder:{
            default:null,//被选中头像边框
            type:cc.Node
        },
        headIndex:{
            default:1,
            type:cc.Integer
        }
    },

    // use this for initialization
    onLoad: function () {
        this.selHead();
    },
    selHead(){//选择头像
        var creatRole = this.node.getComponent('creatRole');
        var self = this;
        ;[].forEach.call(self.item,function(item){
            item.on(cc.Node.EventType.TOUCH_END,function(event){
                var pos = item.getPosition();
                var action = cc.moveTo(0.08,pos);
                self.itemBorder.runAction(action);
                self.headIndex = parseInt(util.splitStr(item.name));
                creatRole.headIndex = self.headIndex;
            },self);
        });
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
