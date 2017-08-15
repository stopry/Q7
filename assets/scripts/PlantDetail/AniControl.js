cc.Class({
    extends: cc.Component,

    properties: {
        aniWrap:{
            default:null,
            type:cc.Node
        },
        btnList:{//四个操作按钮
            default:[],
            type:[cc.Node]
        },
        _speed:0,//小人移动速度
        _direction:1,//小人移动方向

    },

    // use this for initialization
    onLoad: function () {
        //this.animationCtr();
    },
    animationCtr(){
        var self = this;
        var defaultAni = "farmCut_q";
        ;[].forEach.call(self.btnList,function(item){
            item.on(cc.Node.EventType.TOUCH_START,function(event){
                switch(item.name){
                    case "upCut":
                        defaultAni = "farmCut_q";
                        this._direction = 1;
                        break;
                    case "rightCut":
                        defaultAni = "farmCut_r";
                        this._direction = 2;
                        break;
                    case "behindCut":
                        defaultAni = "farmCut_h";
                        this._direction = 3;
                        break;
                    case "leftCut":
                        defaultAni = "farmCut_l";
                        this._direction = 4;
                        break;
                }
                self._speed = 1;
                self.aniWrap.getComponent("cc.Animation").play(defaultAni);
            },self);
        });
        ;[].forEach.call(self.btnList,function(item){
            item.on(cc.Node.EventType.TOUCH_END,function(event){
                self._speed = 0;
                //self.aniWrap.getComponent("cc.Animation").stop();
            },self);
        });
    },
    moveFarm(dir){//移动小人
        switch(dir){
            case 1:
                this.aniWrap.y-=this._speed;
                break;
            case 2:
                this.aniWrap.x+=this._speed;
                break;
            case 3:
                this.aniWrap.y+=this._speed;
                break;
            case 4:
                this.aniWrap.x-=this._speed;
                break;
        }
    },
    stopMove(){
        this._speed = 0;
        this.aniWrap.getComponent("cc.Animation").stop();
    },
    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
         this.moveFarm(this._direction);
     },
});
