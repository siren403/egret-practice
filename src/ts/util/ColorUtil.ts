namespace ColorUtil {

    export function colorToMatrix(color: string, filter?: egret.ColorMatrixFilter): egret.ColorMatrixFilter {

        if (color == null || color == "") {

            return null;
        }
        let r: string = "FF";
        let g: string = "FF";
        let b: string = "FF";

        if (color.length >= 6) {

            r = color.substr(color.length - 6, 2);
            g = color.substr(color.length - 4, 2);
            b = color.substr(color.length - 2, 2);

        }
        let colorFlilter: egret.ColorMatrixFilter = null;
        if (!filter) {
            let colorMatrix = [
                1 / 255 * parseInt(r, 16), 0, 0, 0, 0,
                0, 1 / 255 * parseInt(g, 16), 0, 0, 0,
                0, 0, 1 / 255 * parseInt(b, 16), 0, 0,
                0, 0, 0, 1, 0
            ];
            colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        } else {
            filter.matrix[0] = 1 / 255 * parseInt(r, 16);
            filter.matrix[6] = 1 / 255 * parseInt(g, 16);
            filter.matrix[12] = 1 / 255 * parseInt(b, 16);
            colorFlilter = filter;
        }
        return colorFlilter;
    }
}