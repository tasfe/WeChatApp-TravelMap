import { MapTouchHandler } from "map_touch"
import { MapManager } from "map_manager"

export class MapPage {

  constructor(url, fileCacheKey) {
    this.mapTouchHandler = new MapTouchHandler();
    this.mapManager = new MapManager(url, fileCacheKey);
    this.page = null;

    this.pageObject = {
      data: {
        mapUrl: "",
        mapHeightPercent: 100,
        mapWidthPercent: 100,
        mapOriginalWidth: 0,
        mapOriginalHeight: 0
      },
      onLoad: this._onPageLoad(),
      onTouchMove: this.mapTouchHandler.onTouchScale(),
      onTouchStart: this.mapTouchHandler.onTouchDown(),
      onMapLoad: this._onMapLoad,
      onShareAppMessage: function () {
        return {
          success: function (res) {
            console.log("shared success");
          }
        };
      }
    }
  }

  show() {
    Page(this.pageObject);
  }

  //页面初始化
  _onPageLoad() {
    let mapPage = this;
    return function (options) {
      let page = this;
      mapPage.mapManager.fetch({
        success: function (data) {
          page.setData({
            mapUrl: data
          });
        }
      });
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
}