//打开弹出窗口
cc.Class({
    extends: cc.Component,

    properties: {
        alertBox:{//弹出框
            default:null,
            type:cc.Prefab
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        root:{//根节点
            default:null,
            type:cc.Node
        },
        webUrl:"https://www.baidu.com"
    },

    // use this for initialization
    onLoad: function () {

    },
    open:function(){//打开弹窗
        if(!Global.layer){
            Global.layer = cc.instantiate(this.alertLayer);
            Global.layer.parent = this.root;
        }
        Global.layer.active = true;
        var _alertBox = cc.instantiate(this.alertBox);
        //如果弹框是webview
        if(_alertBox.name=="webPage"){
            //cc.log(_alertBox.getChildByName('webView').getComponent(cc.WebView));
            _alertBox.getChildByName('webView').getComponent(cc.WebView)._url = this.webUrl||'http://www.center.0001wan.com';
        }
        _alertBox.parent = this.root;
        var seq = cc.sequence(cc.scaleTo(0.1, 1.2, 1.2),cc.scaleTo(0.1, 1, 1));
        _alertBox.runAction(seq);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
