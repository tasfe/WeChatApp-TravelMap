export class MapManager {

  constructor(url, fileCacheKey) {
    this.url = url;
    this.fileCacheKey = fileCacheKey;
  }

  //获取地图
  fetch(callBack) {
    //先看是否有文件缓存
    wx.getStorage({
      key: this.fileCacheKey,
      success: function (res) {
        console.log("get map file cache success " + res.data);
        if (callBack != null) {
          callBack.success(res.data);
        }
      },
      fail: this._downloadMap(callBack)
    })
  }

  //下载地图
  _downloadMap(callBack) {
    let mapManager = this;
    return function () {
      console.log("start download map");
      wx.downloadFile({
        url: mapManager.url,
        success: mapManager._downloadMapSuccess(mapManager, callBack),
        fail: function () {
          console.log("download map fail");
          if (callBack != null) {
            callBack.fail();
          }
        }
      });
    };
  }

  //地图下载成功
  _downloadMapSuccess(mapManager, callBack) {
    return function (res) {
      console.log("download map success:" + res.tempFilePath);
      wx.saveFile({
        tempFilePath: res.tempFilePath,
        success: mapManager._saveMapSuccess(mapManager, callBack),
        fail: function () {
          console.log("save map fail");
          if (callBack != null) {
            callBack.success(res.tempFilePath);
          }
        }
      });
    };
  }

  //地图文件缓存保存成功
  _saveMapSuccess(mapManager, callBack) {
    return function (res) {
      console.log("save map success:" + res.savedFilePath);
      wx.setStorage({
        key: mapManager.fileCacheKey,
        data: res.savedFilePath,
      });

      if (callBack != null) {
        callBack.success(res.savedFilePath);
      }
    };
  }
}