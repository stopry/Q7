var util = require('Util');
var Net = require('Net');
var config = require('GuideConfig');//游戏引导配置
cc.Class({
    extends: cc.Component,

    properties: {
        //遮罩层
        masker:{
            default:null,
            type:cc.Node
        },
        //点击区域
        clicker:{
            default:null,
            type:cc.Node
        }
    },
    // use this for initialization
    onLoad: function () {
        this.initGuide();
        this.action();
    },
    initGuide(){
        //阻止mask向下传递事件
        this.node.on('touchstart', function(event){
            event.stopPropagation();
        }, this);
    },
    //设置masker和clicker的位置
    setPos(obj){
      this.masker.setPosition(obj);
      this.clicker.setPosition(obj);
    },
    //新手引导开始
    action(){
        this.clicker.on('touchstart', function(event){
            this["step_"+Global.guideStep]();
            /*switch (Global.guideStep){
                case 1:
                    this.step_1();
                    break;
                case 2:
                    this.step_2();
                    break;
                case 3:
                    this.step_3();
                    break;
                case 4:
                    this.step_1();
                    break;
            }*/
        }, this);
    },
    //步骤1
    step_1(){
        this.setPos(config[0].pos);
        cc.find('Game').getComponent('Game').toggleHeader();
        Global.guideStep = 2;
    },
    //步骤2
    step_2(){
        this.setPos(config[1].pos);
        Global.guideStep = 3;
    },
    //步骤3
    step_3(){
        this.setPos(config[2].pos);
        Global.guideStep = 1;
    },
    onDestroy(){

    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
