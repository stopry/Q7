var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        //确认框资源start
        conDia:{//确认对话框
            default:null,
            type:cc.Prefab
        },
        root:{//根节点
            default:null,
            type:cc.Node
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        //确认框资源end
        friendsItemBox:{//好友列表项容器
            default:null,
            type:cc.Node
        },
        friendsItemPre:{//好友列表项预制
          default:null,
          type:cc.Prefab
        },
        nextBtn:{//下一页按钮
            default:null,
            type:cc.Node
        },
        preBtn:{//上一页按钮
            default:null,
            type:cc.Node
        },
        cuurentPage:{//当前页数
            default:null,
            type:cc.Label
        },
        allPage:{//总页数
            default:null,
            type:cc.Label
        },
        littleTip:{//小提示
            default:null,
            type:cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {
        this.createItemPool();
        this.curPageNum = 1;//默认当前页
        this.allPageNum = 10;//默认总页数
        this.isLoading = false;//默认不在加载中
        this.nextBtn.on(cc.Node.EventType.TOUCH_END,function(){
            this.nextPage();
        },this);
        this.preBtn.on(cc.Node.EventType.TOUCH_END,function(){
            this.prePage();
        },this);
    },
    createItemPool(){//对象池
        this.itemPool = new cc.NodePool();
    },
    renderFriendsList(){//渲染好友列表
        if(this.isLoading) return;
        var itemLen = this.friendsItemBox.getChildren().length;
        for(var l = 0;l<itemLen;l++){
            this.itemPool.put(this.friendsItemBox.getChildren()[0]);
        }
        this.getFriendList();

    },
    getFriendList(){//得到好友列表
        var self = this;
        this.getComponent('ReqAni').showReqAni();
        this.isLoading = true;
        Net.get('/api/game/friend/list',1,{pageNum:self.curPageNum},function(data){
            if(!data.success){
                this.showLittleTip(data.msg)
            }else if(data.obj.records.length<=0){
                this.showLittleTip('没有好友')
                this.allPage.string = 0;
                this.cuurentPage.string = 0;
            }else{
                cc.log(data);
                var recs = data.obj.records
                var _len = recs.length;
                var item = null;
                for(let i = 0;i<_len;i++){
                    if(this.itemPool.size()>0){
                        item = this.itemPool.get();
                    }else{
                        item = cc.instantiate(this.friendsItemPre);
                    }
                    this.friendsItemBox.addChild(item);
                    item.getComponent('SetFriendsItem').setItem(recs[i].playerId,recs[i].nickname,recs[i].certLev);
                }
                this.allPage.string = data.obj.pages;
                this.allPageNum = data.obj.pages;
                this.cuurentPage.string = data.obj.current;
            }
            this.isLoading = false;
            this.getComponent('ReqAni').hideReqAni();
        }.bind(this),function(data){
            this.isLoading = false;
        }.bind(this))
    },
    nextPage(){
        if(this.curPageNum>=this.allPageNum){
            this.showLittleTip('没有下一页了');
            return
        };
        this.curPageNum++;
        this.renderFriendsList();
    },
    prePage(){
        if(this.curPageNum<=1){
            this.showLittleTip('没有上一页');
            return
        };
        this.curPageNum--;
        this.renderFriendsList();
    },
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
        this.renderFriendsList();
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    showConDia(msg,fn1,fn2){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = this.root;
        Global.conLayer.active = true;

        var dia = cc.instantiate(this.conDia);
        dia.parent = this.root;
        dia.getComponent('ConfirmDia').setBoxFun(msg,fn1,fn2);
        dia.getComponent('ConfirmDia').showThis();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
