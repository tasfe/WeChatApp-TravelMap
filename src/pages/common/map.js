import { MapTouchHandler } from "map_touch"
import { FileDownloader } from "../../libs/filedownloader/file_downloader"
import { PaintBox } from "paint_box"

export class Map {

  constructor(url, key) {
    this.mapTouchHandler = new MapTouchHandler(this);
    this.page = null;
    this.key = key;
    this.url = url;
    this.currentScale = 1.0;

    this.pageObject = {
      data: {
        mapUrl: "",
        mapHeightPercent: 100,
        mapWidthPercent: 100,
        mapOriginalWidth: 0,
        mapOriginalHeight: 0,
        isPaintBoxShown: false
      },
      onLoad: this._onPageLoad(),
      // onReady: this._onPageReady(),
      onTouchMove: this.mapTouchHandler.onTouchScale(),
      onTouchStart: this.mapTouchHandler.onTouchDown(),
      onMapLoad: this._onMapLoad,
      onShareAppMessage: function () {
        return {
          success: function (res) {
            console.log("shared success");
          }
        };
      },
      onMapZoomIn: this.zoom(true),
      onMapZoomOut: this.zoom(false),
      // onPaintBoxTrigger: this.paintBox.onReversalVisible(),
      // onPaintTouchMove: this.paintBox.onTouchMove
    }
  }

  show() {
    wx.showLoading({
      title: '加载中',
    });

    Page(this.pageObject);
  }

  //页面初始化
  _onPageLoad() {
    let map = this;

    return function (options) {
      let page = this;

      let fileDownloader = new FileDownloader(map.url);
      fileDownloader.fetch({
        success: function (data) {
          page.setData({
            mapUrl: data
          });

          wx.hideLoading();
        },
        fail: function () {
          wx.hideLoading();
        }
      });

    };
  }

  //页面初次渲染完成
  _onPageReady() {
    this.paintBox = new PaintBox();
    return function (e) {

    };
  }

  //地图显示加载完成
  _onMapLoad(event) {

    this.setData({
      mapOriginalWidth: event.detail.width,
      mapOriginalHeight: event.detail.height
    });

    console.log("width " + this.data.mapOriginalWidth + " height " + this.data.mapOriginalHeight);

  }

  //缩放地图
  scale(map, page, newScale) {
    if (newScale <= 1) {
      //最小缩到100% 则不能再缩小
      return;
    }

    let originalWidth = page.data.mapOriginalWidth;
    let originalHeight = page.data.mapOriginalHeight;

    let scaleWidth = newScale * originalWidth;
    let scaleHeight = newScale * originalHeight;

    let scaleWidthPercent = newScale * 100;
    let scaleHeightPercent = newScale * 100;

    map.currentScale = newScale;

    console.log("scale width percent " + scaleWidthPercent + " height percent " + scaleHeightPercent);

    page.setData({
      mapHeightPercent: scaleHeightPercent,
      mapWidthPercent: scaleWidthPercent
    });
  }

  zoom(zoomIn) {
    let map = this;
    return function () {
      if (zoomIn) {
        map.scale(map, this, map.currentScale + 0.1);
      } else {
        map.scale(map, this, map.currentScale - 0.1);
      }
    };
  }
}