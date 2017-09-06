const {ccclass, property} = cc._decorator;

@ccclass()
export default class LoadingTs extends cc.Component {

    @property(cc.Node)
    plane: cc.Node=null;//飞机

    @property(cc.Node)
    grass:cc.Node=null;//草地

    @property(cc.ProgressBar)
    progress:cc.ProgressBar=null;//进度条

    @property(cc.Label)
    text:cc.Label=null;//进度文字

    @property({
        type: cc.Integer
    })
    private maxWidth: number = 538;//草地最大长度

    @property({
        type:cc.Integer
    })
    private maxDistance:number = 520;//飞机最大距离
    //
    onLoad() {
        cc.loader.loadResDir('/', (num, totalNum, item):void=>{
            /**
             @param num->现在加载的数量
             @param totalNum->总数量
             @param itme->现在加载的资源项目;</br>
            * */
            let pge = num/totalNum;
            this.progress.progress = pge;
            this.plane.x = this.maxDistance*pge;
            this.grass.width = this.maxWidth*pge;
            this.text.string = parseInt(pge*100)+"%";
            if(pge>=1){
                cc.director.loadScene("LogIn",()=>{//进入登录界面

                });
            }
        },(err, assets)=>{
            //cc.log(assets)
        });
        cc._initDebugSetting(cc.DebugMode.INFO);
    }
}
