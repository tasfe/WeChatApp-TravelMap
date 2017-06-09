export class PaintBox {

  constructor() {
    this.canvas = wx.createCanvasContext("paint_map_canvas");
    this.canvas.setStrokeStyle("#00ff00")
    this.canvas.setLineWidth(5)
    this.canvas.rect(0, 0, 200, 200)
    this.canvas.stroke()
    this.canvas.setStrokeStyle("#ff0000")
    this.canvas.setLineWidth(2)
    this.canvas.moveTo(160, 100)
    this.canvas.arc(100, 100, 60, 0, 2 * Math.PI, true)
    this.canvas.moveTo(140, 100)
    this.canvas.arc(100, 100, 40, 0, Math.PI, false)
    this.canvas.moveTo(85, 80)
    this.canvas.arc(80, 80, 5, 0, 2 * Math.PI, true)
    this.canvas.moveTo(125, 80)
    this.canvas.arc(120, 80, 5, 0, 2 * Math.PI, true)
    this.canvas.stroke()
    this.canvas.draw()
  }

  onReversalVisible(page) {
    return function (event) {
      this.setData({
        isPaintBoxShown: !this.data.isPaintBoxShown
      });
    }
  }

  onTouchMove(event) {
    let startX1 = event.touches[0].clientX;
    let startY1 = event.touches[0].clientY;

    console.log("paint move " + startX1 + " " + startY1);
  }

}