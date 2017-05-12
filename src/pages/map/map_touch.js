export class MapTouchHandler {

  constructor() {
    this.oldDistance = 0;
    this.oldScale = 1.0;
  }

  //计算多指间距离
  _calTouchDistance(event) {
    if (event.touches.length <= 1) {
      return 0;
    }

    let xMove = event.touches[1].clientX - event.touches[0].clientX;
    let yMove = event.touches[1].clientY - event.touches[0].clientY;
    return Math.sqrt(xMove * xMove + yMove * yMove);
  }

  //多指按下
  onTouchDown() {
    let mapTouchHandler = this;
    return function (event) {
      if (this.data.mapOriginalWidth <= 0 || this.data.mapOriginalHeight <= 0) {
        return;
      }

      mapTouchHandler.oldDistance = mapTouchHandler._calTouchDistance(event);
    }
  }

  //多指缩放
  onTouchScale() {
    let mapTouchHandler = this;
    return function (event) {
      let originalWidth = this.data.mapOriginalWidth;
      let originalHeight = this.data.mapOriginalHeight;
      if (originalHeight <= 0 || originalWidth <= 0) {
        return;
      }

      if (mapTouchHandler.oldDistance == 0) {
        // console.log("old disctance ==0")
        return;
      }

      let newDistance = mapTouchHandler._calTouchDistance(event);
      if (newDistance == 0) {
        return;
      }

      let distanceDiff = newDistance - mapTouchHandler.oldDistance;
      if (distanceDiff == 0) {
        return;
      }

      mapTouchHandler.oldDistance = newDistance;
      // distanceDiff 为正数时，表示两指间距离在变大，图片需要被放大；反之，则代表两指间距缩小，图片需要被缩小。

      // 在实测中，使用 0.005 这个值可获得比较良好的缩放体验。
      let newScale = mapTouchHandler.oldScale + 0.005 * distanceDiff;
      if (newScale <= 1) {
        //最小缩到100%
        return;
      }

      let scaleWidth = newScale * originalWidth;
      let scaleHeight = newScale * originalHeight;
      mapTouchHandler.oldScale = newScale;

      let scaleWidthPercent = newScale * 100;
      let scaleHeightPercent = newScale * 100;

      console.log("scale width percent " + scaleWidthPercent + " height percent " + scaleHeightPercent);

      this.setData({
        mapHeightPercent: scaleHeightPercent,
        mapWidthPercent: scaleWidthPercent
      });
    };
  }
}