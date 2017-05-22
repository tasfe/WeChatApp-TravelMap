import { MapTouchHandler } from "map_touch"
import { FileDownloader } from "../../libs/filedownloader/file_downloader"

export class MapPage {

  constructor(url, key) {
    this.mapTouchHandler = new MapTouchHandler();
    this.page = null;
    this.key = key;
    this.url = url;

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
    wx.showLoading({
      title: '加载中',
    });

    Page(this.pageObject);
  }

  //页面初始化
  _onPageLoad() {
    let mapPage = this;
    return function (options) {
      let page = this;
      // console.log('https://wxapi.hotapp.cn/api/get?appkey=hotapp171780744&key=' + mapPage.key);

      // wx.request({
      //   url: 'https://wxapi.hotapp.cn/api/get',
      //   data: {
      //     appkey: 'hotapp171780744',
      //     key: mapPage.key,
      //   },
      //   success: function (res) {
      //     console.log(res.data);

      //     let fileDownloader = new FileDownloader(res.data.data.value);
      //     fileDownloader.fetch({
      //       success: function (data) {
      //         page.setData({
      //           mapUrl: data
      //         });

      //         wx.hideLoading();
      //       },
      //       fail: function () {
      //         wx.hideLoading();
      //       }
      //     });
      //   },
      //   fail: function () {
      //     console.log("request api fail ");
      //   },
      //   complete: function () {
      //     console.log("request api complete");
      //   }
      // });

      let fileDownloader = new FileDownloader(mapPage.url);
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

  //地图显示加载完成
  _onMapLoad(event) {

    this.setData({
      mapOriginalWidth: event.detail.width,
      mapOriginalHeight: event.detail.height
    });

    console.log("width " + this.data.mapOriginalWidth + " height " + this.data.mapOriginalHeight);

  }
}