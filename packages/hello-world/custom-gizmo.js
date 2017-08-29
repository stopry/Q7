'use strict';

class CustomGizmo extends Editor.Gizmo {
    init () {
        // 初始化一些参数
    }
    
    getPointInNode(node,PointInView){
        let pointInWorld = this._view.pixelToWorld(PointInView);
        let pointInNode = node.convertToNodeSpaceAR(pointInWorld);
        return Editor.GizmosUtils.snapPixelWihVec2(pointInNode);
    }
    
    createGizmoCallBacks () {
        // 创建 gizmo 操作回调

        // 申明一些局部变量
        let pressX, pressY;     // 按下鼠标时记录的鼠标位置
        let updated;            // 记录 gizmo 是否被操作过

        return {
            /**
             * 在 gizmo 上按下鼠标时触发
             * @property x 按下点的 x 坐标
             * @property y 按下点的 y 坐标
             * @property event mousedown dom event
             */
            start: (x, y, event) => {
                
                pressX = x;
                pressY = y;
                updated = false;
                
                let node = this.node;
                
                let recentPoint = this.getPointInNode(node,cc.v2(pressX,pressY));
                
                this.target.points.push(recentPoint);
            },

            /**
             * 在 gizmo 上按下鼠标移动时触发
             * @property dx 鼠标移动的 x 位移
             * @property dy 鼠标移动的 y 位移
             * @property event mousedown dom event
             */
            update: (dx, dy, event) => {
                if (dx === 0 && dy === 0) {
                    return;
                }
                updated = true;

                // 获取 gizmo 依附的节点
                let node = this.node;

                // 记录节点信息的 undo 信息，注意参数为节点的 uuid
                _Scene.Undo.recordNode( node.uuid );
                
                let currentX = pressX + dx;
                let currentY = pressY + dy;

                let recentPoint = this.getPointInNode(node,cc.v2(currentX,currentY));
                
                this.target.points[this.target.points.length - 1] = recentPoint; 
                
                

                // 更新 gizmo view 
                this._view.repaintHost();
            },

            /**
             * 在 gizmo 抬起鼠标时触发
             * @property event mousedown dom event
             */
            end: (event) => {
                // 判断是否有操作过 gizmo, 没有则跳过处理
                if (updated) {
                    // 如果 gizmo 有修改需要进入 animation 编辑的属性，需要调用此接口来更新数据
                    // _Scene.AnimUtils.recordNodeChanged(this.node);

                    // 推送修改到 undo 下，结束 undo
                    _Scene.Undo.commit();
                }
            }
        };
    }

    onCreateRoot () {
        // 创建 svg 根节点的回调，可以在这里创建你的 svg 工具
        // this._root 可以获取到 Editor.Gizmo 创建的 svg 根节点

        // 实例：

        // 创建一个 svg 工具
        // group 函数文档 : http://documentup.com/wout/svg.js#groups
        this._tool = this._root.group();

        let polygon = this._tool.polygon()
            // 设置 circle fill 样式
            .fill( { color: 'rgba(255,255,255,0)' } )
            // 设置 circle stroke 样式
            .stroke( { color: 'rgba(255,255,255,0)', width: 1 } )
            // 设置 circle 的点击区域，这里设置的是根据 fill 模式点击
            .style( 'pointer-events', 'fill' )
            // 设置 circle 鼠标样式
            .style( 'cursor', 'pointer' )
            ;
            
        let polygon2 = this._tool.polygon()
            // 设置 circle fill 样式
            .fill( { color: 'rgba(255,255,255,0.2)' } )
            // 设置 circle stroke 样式
            .stroke( { color: 'rgba(255,255,255,0.5)', width: 1 } )
            // 设置 circle 的点击区域，这里设置的是根据 fill 模式点击
            .style( 'pointer-events', 'fill' )
            // 设置 circle 鼠标样式
            .style( 'cursor', 'pointer' )
            ;
            


        // 为 tool 定义一个绘画函数，可以为其他名字
        this._tool.plot =  (points2, points, position) => {
            this._tool.move(position.x, position.y);
            polygon.plot(points);
            polygon2.plot(points2);
        };

        // 创建 gizmo 操作回调函数
        let callbacks = this.createGizmoCallBacks();

        // 为 tool 添加一个操作回调
        // 当在 tool 上按下鼠标时，会创建一个 drag mask
        // 如果不需要此辅助函数，可以自行对 tool 注册 mousedown, mousemove, mouseup 来进行操作
        Editor.GizmosUtils.addMoveHandles( this._tool, {cursor: 'pointer'}, callbacks );
        


    }
    
    getCornerPointsInView(){
        let node = this.node;
        let leftUp = this.getCornerPointInView(cc.p(-node.width/2,node.height/2));
        let rightUp = this.getCornerPointInView(cc.p(node.width/2,node.height/2));
        let rightDown = this.getCornerPointInView(cc.p(node.width/2,-node.height/2));
        let leftDown = this.getCornerPointInView(cc.p(-node.width/2,-node.height/2));    
        return [leftUp,rightUp,rightDown,leftDown];
    }
    
    getCornerPointInView(pointInNode){
        let node = this.node;
        let pointInWorld = node.convertToWorldSpaceAR(pointInNode);
        let worldPosition = node.convertToWorldSpaceAR(cc.p(0, 0));
        let pointDeltaInWorld = worldPosition.sub(pointInWorld);
        let pointLimited = Editor.GizmosUtils.snapPixelWihVec2(pointDeltaInWorld);
        return [-pointLimited.x,pointLimited.y];
    }
    
    getOutLinePointsInView(){
        let node = this.node;
        let target = this.target;
        let points = target.points;
        let pointsInView = [];
        for(let i of points){
            
            let pointInView = this.getOutLinePointInView(i);
            pointsInView.push(pointInView);
        }
        return pointsInView;
    }
    
    getOutLinePointInView(pointInNode){
        let node = this.node;
        let pointInWorld = node.convertToWorldSpaceAR(pointInNode);
        let worldPosition = node.convertToWorldSpaceAR(cc.p(0, 0));
        let pointDeltaInWorld = worldPosition.sub(pointInWorld);
        let pointLimited = Editor.GizmosUtils.snapPixelWihVec2(pointDeltaInWorld);
        return [-pointLimited.x,pointLimited.y];
    }

    onUpdate () {
        // 更新 svg 工具

        // 获取 gizmo 依附的组件
        let target = this.target;

        // 获取 gizmo 依附的节点
        let node = this.node;

        // 获取组件半径
        let radius = target.radius;

        // 获取节点世界坐标
        let worldPosition = node.convertToWorldSpaceAR(cc.p(0, 0));

        // 转换世界坐标到 svg view 上
        // svg view 的坐标体系和节点坐标体系不太一样，这里使用内置函数来转换坐标
        let viewPosition = this._view.worldToPixel(worldPosition);

        // 对齐坐标，防止 svg 因为精度问题产生抖动
        let p = Editor.GizmosUtils.snapPixelWihVec2( viewPosition );

        let points = this.getCornerPointsInView();
        let points2 = this.getOutLinePointsInView();
        
        // 移动 svg 工具到坐标
        this._tool.plot(points2, points, p);
    }
}

module.exports = CustomGizmo;