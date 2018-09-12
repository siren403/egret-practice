module transform {

    export function getCascadePosition(target: egret.DisplayObject, end: egret.DisplayObject): egret.Point {
        let pos = egret.Point.create(0, 0);
        let parent: egret.DisplayObject = target;
        while ((end != null && parent != end) && parent != null) {
            pos.x = (pos.x + (parent.x - parent.anchorOffsetX)) * parent.scaleX;
            pos.y = (pos.y + (parent.y - parent.anchorOffsetY)) * parent.scaleY;
            parent = parent.parent;
        }
        return pos;
    }

    export function getCascadeRectangle(target: egret.DisplayObject, end: egret.DisplayObject, resultRect?: egret.Rectangle): egret.Rectangle {
        let rect: egret.Rectangle;

        if (resultRect) {
            rect = resultRect;
        } else {
            rect = egret.Rectangle.create();
        }

        rect.setEmpty();
        let parent: egret.DisplayObject = target;

        let accScaleX = Math.abs(target.scaleX);
        let accScaleY = Math.abs(target.scaleY);

        while ((end != null && parent != end) && parent != null) {

            let parentScaleX: number = Math.abs(parent.scaleX);
            let parentScaleY: number = Math.abs(parent.scaleY);

            rect.x = (rect.x + (parent.x - parent.anchorOffsetX)) * parentScaleX;
            rect.y = (rect.y + (parent.y - parent.anchorOffsetY)) * parentScaleY;
            accScaleX *= parentScaleX;
            accScaleY *= parentScaleY;
            parent = parent.parent;
        }

        rect.width = target.width * accScaleX;
        rect.height = target.height * accScaleY;

        return rect;
    }

    export function changeHierarchy(target: egret.DisplayObject, to: egret.DisplayObjectContainer, at?: number): void {

        let pos = egret.Point.create(target.x, target.y);
        if (target.parent) {
            target.parent.localToGlobal(pos.x, pos.y, pos);
        }
        to.globalToLocal(pos.x, pos.y, pos);
        if (at !== undefined) {
            to.addChildAt(target, at);
        } else {
            to.addChild(target);
        }
        target.x = pos.x;
        target.y = pos.y;
    }

    let previousRectangle: egret.Rectangle = null;
    let nextRectangle: egret.Rectangle = null;

    export function createRectangle(): egret.Rectangle {
        let rect = egret.Rectangle.create();
        nextRectangle = egret.Rectangle.create();

        // let count = 0;
        while (rect.hashCode == nextRectangle.hashCode) {
            nextRectangle = egret.Rectangle.create();
            // count++;
        }
        egret.Rectangle.release(nextRectangle);
        nextRectangle = null;

        return rect;
    }

    export function flushRectangle(): void {
        let rect = egret.Rectangle.create();
        nextRectangle = egret.Rectangle.create();
        // let count = 0;
        while (rect.hashCode == nextRectangle.hashCode) {
            nextRectangle = egret.Rectangle.create();
            // count++;
        }
        egret.Rectangle.release(nextRectangle);
        egret.Rectangle.release(rect);
        nextRectangle = null;
    }
}