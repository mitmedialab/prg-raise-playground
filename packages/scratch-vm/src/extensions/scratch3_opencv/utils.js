const { countNonZero } = require('@techstark/opencv-js');
const cv = require('@techstark/opencv-js');

const get_bbox = (color_mask) => {
    let contours = new cv.MatVector()
    let hierarchy = new cv.Mat()
    // console.log('adfadsfa', color_mask, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
    cv.findContours(color_mask, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
    let object_area = 0
    let object_x = 0
    let object_y = 0
    let object_w = 0
    let object_h = 0
    let center_x = 0
    let center_y = 0

    for (let i = 0; i < contours.size(); i++) {
        let contour = contours.get(i)
        // console.log(contours, contour)
        let x, y, width, height = cv.boundingRect(contour)
        let found_area = width * height
        if (object_area < found_area) {
            object_area = found_area
            object_x = x
            object_y = y
            object_w = width
            object_h = height
            center_x = int(x + (width / 2))
            center_y = int(y + (height / 2))
        }
    }

    return [object_area, object_x, object_y, object_w, object_h, center_x, center_y]
}
    
exports.get_bbox = get_bbox;