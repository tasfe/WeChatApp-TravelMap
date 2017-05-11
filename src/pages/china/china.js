
var mapFileCacheKey = 'china'

var pageObject = {
  data: {
    mapUrl: "",
    mapHeightPercent: 100,
    mapWidthPercent: 100
  },
  onLoad: onPageLoad,
  onTouchMove: onTouchScale,
  onTouchStart: onTouchDown,
  onMapLoad: onMapLoad
}

Page(pageObject)

//页面初始化
function onPageLoad(options) {
  var that = this
  //先看是否有文件缓存
  wx.getStorage({
    key: mapFileCacheKey,
    success: function (res) {
      console.log("get map file cache success " + res.data)
      that.setData(
        {
          mapUrl: res.data
        }
      )
    },
    fail: downloadMap(that)
  })
}

//下载地图
function downloadMap(that) {
  return function(){
    console.log("start download map")
    wx.downloadFile({
      url: "https://raw.githubusercontent.com/hcq0618/WeChatApp-TravelMap/master/china.jpg",
      success: downloadMapSuccess(that)
    })
  }
}

//地图下载成功
function downloadMapSuccess(that) {
  return function (res) {
    console.log("download map success:" + res.tempFilePath)
    wx.saveFile({
      tempFilePath: res.tempFilePath,
      success: saveMapSuccess(that)
    })
  }
}

//地图文件缓存保存成功
function saveMapSuccess(that) {
  return function (res) {
    console.log("save map success:" + res.savedFilePath)
    wx.setStorage({
      key: mapFileCacheKey,
      data: res.savedFilePath,
    })

    that.setData({
      mapUrl: res.savedFilePath
    })
  }
}

//多指按下
var oldDistance = 0
function onTouchDown(event) {
  if (mapOriginalHeight <= 0 || mapOriginalWidth <= 0) {
    return
  }

  oldDistance = calTouchDistance(event)
}

//计算多指间距离
function calTouchDistance(event) {
  if (event.touches.length <= 1) {
    return 0
  }

  var xMove = event.touches[1].clientX - event.touches[0].clientX;
  var yMove = event.touches[1].clientY - event.touches[0].clientY;
  return Math.sqrt(xMove * xMove + yMove * yMove);
}

//多指缩放
var oldScale = 1.0
function onTouchScale(event) {
  if (mapOriginalHeight <= 0 || mapOriginalWidth <= 0) {
    return
  }

  if (oldDistance == 0) {
    return
  }

  var newDistance = calTouchDistance(event);
  if (newDistance == 0) {
    return
  }

  var distanceDiff = newDistance - oldDistance
  if (distanceDiff == 0) {
    return
  }

  oldDistance = newDistance
  // distanceDiff 为正数时，表示两指间距离在变大，图片需要被放大；反之，则代表两指间距缩小，图片需要被缩小。

  // 在实测中，使用 0.005 这个值可获得比较良好的缩放体验。
  var newScale = oldScale + 0.005 * distanceDiff
  if (newScale <= 1) {
    //最小缩到100%
    return
  }

  var scaleWidth = newScale * mapOriginalWidth;
  var scaleHeight = newScale * mapOriginalHeight;
  oldScale = newScale

  var scaleWidthPercent = newScale * 100
  var scaleHeightPercent = newScale * 100

  console.log("scale width percent " + scaleWidthPercent + " height percent " + scaleHeightPercent)

  this.setData({
    mapHeightPercent: scaleHeightPercent,
    mapWidthPercent: scaleWidthPercent
  })
}

//地图显示加载完成
var mapOriginalWidth = 0, mapOriginalHeight = 0
function onMapLoad(event) {
  mapOriginalWidth = event.detail.width
  mapOriginalHeight = event.detail.height

  console.log("width " + mapOriginalWidth + " height " + mapOriginalHeight)
}

