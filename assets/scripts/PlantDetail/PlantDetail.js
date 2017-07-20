cc.Class({
    extends: cc.Component,

    properties: {
        plane:{//飞机
            default:null,
            type:cc.Node
        },
        plantBtn:{//种植按钮
            default:null,
            type:cc.Button
        }
    },

    // use this for initialization
    onLoad: function () {
        // 关闭fps
        cc.director.setDisplayStats(false);
        this.renderTree(1,1);
    },
    renderTree(status,type){
        this.status = status;
        this.type = type;
    },
    resetPlane(vec){//重置飞机
        this.scheduleOnce(function() {
            this.plane.setPosition(vec);
            this.plane.getComponent(cc.Animation).stop();
            this.plane.active = false;
            this.plantBtn.interactable = true;

        },4.1);
    },
    playPlane(){//播放飞机
        //this.plantBtn.enabled = false;
        this.plantBtn.interactable = false ;
        var pos = this.plane.getPosition();
        var finished = cc.callFunc(this.resetPlane(pos));
        this.plane.active = true;
        this.plane.getComponent(cc.Animation).play();
        var actionTo = cc.sequence(cc.moveBy(4, cc.p(840, 0)), cc.fadeIn(0), finished);
        this.plane.runAction(actionTo);
    },
    back(){//返回主游戏界面
        cc.director.loadScene("Game",function(){//回调

        });
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
