//阻止事件冒泡
const {ccclass, property} = cc._decorator;//从cc._decorator命名空间引入ccclass和property装饰器
@ccclass//使用装饰器声明CCClass
export default class StoPro extends cc.Component{

    @property(cc.Node)// 使用 property 装饰器声明属性，括号里是属性类型，装饰器里的类型声明主要用于编辑器展示
    touchTarget:cc.Node=null;// 这里是 TypeScript 用来声明变量类型的写法，冒号后面是属性类型;

    // 成员方法与js类似
    onLoad():void {
       this.touchTarget.on('touchstart',(event):void=>{
           event.stopPropagation();
       })
    }
}