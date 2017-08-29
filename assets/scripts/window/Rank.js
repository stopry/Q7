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
        rankItemBox:{//好友列表项容器
            default:null,
            type:cc.Node
        },
        rankItemPre:{//好友列表项预制
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
        this.isLoading = false;//默认不在加载中
        this.createItemPool();
        this.curPageNum = 1;//默认当前页
        this.allPageNum = 10;//默认总页数
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
    renderRankList(){//渲染排行榜列表
        var itemLen = this.rankItemBox.getChildren().length;
        for(var l = 0;l<itemLen;l++){
            this.itemPool.put(this.rankItemBox.getChildren()[0]);
        }
        this.getRankData();
    },
    getRankData(){//得到排行榜数据
        this.isLoading = true;
        Net.get('/api/game/ranking/list',1,null,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
            }else if(!data.obj||data.obj.length<=0||data.obj.records.length<=0){
                this.showLittleTip('没有数据');
            }else{
                var item = null;
                for(let i = 0;i<10;i++){
                    if(this.itemPool.size()>0){
                        item = this.itemPool.get();
                    }else{
                        item = cc.instantiate(this.rankItemPre);
                    }
                    this.rankItemBox.addChild(item);
                    item.getComponent('SetRankItem').setItem('10086','我的名字'+i,i,i);
                }
                this.allPage.string = data.obj.pages;
                this.allPageNum = data.obj.pages;
                this.cuurentPage.string = data.obj.current;
            }
            this.isLoading = false;
        }.bind(this),function(data){
            this.isLoading = false;
        }.bind(this));
    },
    nextPage(){
        if(this.curPageNum>=this.allPageNum){
            this.showLittleTip('没有下一页了');
            return
        };
        this.curPageNum++;
        this.renderRankList();
    },
    prePage(){
        if(this.curPageNum<=1){
            this.showLittleTip('没有上一页');
            return
        };
        this.curPageNum--;
        this.renderRankList();
    },
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
        this.renderRankList();
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
