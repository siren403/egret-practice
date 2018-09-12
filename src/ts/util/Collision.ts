namespace Collision {

    export function circleToCircle(
        x1: number, y1: number, radius1: number,
        x2: number, y2: number, radius2: number
    ): boolean {
        let sumRadius = radius1 + radius2;
        let distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        return distance < sumRadius;
    }

    export function capsuleToCircle(
        x1: number, y1: number, dir1X: number, dir1Y: number, radius1: number,
        x2: number, y2: number, radius2: number
    ): boolean {
        let capsuleCenterX: number = 0;
        let capsuleCenterY: number = 0;
        //w
        let wX = x2 - x1;
        let wY = y2 - y1;

        let proj = Math2.dot(wX, wY, dir1X, dir1Y);

        if (proj <= 0) {
            capsuleCenterX = x1;
            capsuleCenterY = y1;
        } else {
            let vsq: number = Math2.dot(dir1X, dir1Y, dir1X, dir1Y);
            if (proj >= vsq) {
                capsuleCenterX = x1 + dir1X;
                capsuleCenterY = y1 + dir1Y;
            } else {
                capsuleCenterX = x1 + (proj / vsq) * dir1X;
                capsuleCenterY = y1 + (proj / vsq) * dir1Y;
            }
        }
        return circleToCircle(capsuleCenterX, capsuleCenterY, radius1, x2, y2, radius2);
    }
}
