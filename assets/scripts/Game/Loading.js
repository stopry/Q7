cc.Class({
    extends: cc.Component,

    properties: {
        plane:{
            default:null,
            type:cc.Node
        },//飞机
        grass:{
            default:null,
            type:cc.Node
        },//草地
        progress:{
            default:null,
            type:cc.ProgressBar
        },//进度条
        text:{
          default:null,
          type:cc.Label
        },
        maxWidth: 538,//草地最大长度
        maxDistance: 520,//飞机最大距离
    },
    // use this for initialization
    onLoad: function () {
        cc.loader.loadResDir('/global', function (num, totalNum, item) {
            //cc.log(num,totalNum,item)
            var pge = num/totalNum;
            this.progress.progress = pge;
            this.plane.x = this.maxDistance*pge;
            this.grass.width = this.maxWidth*pge;
            this.text.string = parseInt(pge*100)+"%";
            if(pge>=1){
                cc.director.loadScene("LogIn",function(){//进入登录界面

                }.bind(this));
            }
        }.bind(this),function(err, assets) {
            //cc.log(assets)
        }.bind(this));

        cc._initDebugSetting(cc.DebugMode.INFO);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
