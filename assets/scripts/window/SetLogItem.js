cc.Class({
    extends: cc.Component,

    properties: {
        img:{//日志图片
            default:null,
            type:cc.Sprite
        },
        day:{//日期
            default:null,
            type:cc.Label
        },
        time:{//时间
            default:null,
            type:cc.Label
        },
        con:{//日志内容
            default:null,
            type:cc.Label
        },
        imgIndex:{//图片索引
            default:0,
            type:cc.Integer
        },
        spriteList:{//图片列表
            default:[],
            type:[cc.SpriteFrame]
        }
    },

    // use this for initialization
    onLoad: function () {

    },
    setItem(day,time,con,img){//设置日志item显示
        this.day.string = day;//日期
        this.time.string = time;//时间
        this.con.string = con;//内容
        this.img.spriteFrame = this.spriteList[img];
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
