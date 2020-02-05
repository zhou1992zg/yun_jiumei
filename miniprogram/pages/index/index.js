//index.js
const app = getApp()

Page({
  data: {
    swiperList: [],
    bannerList: [{
      name: "红葡萄酒"
    }, {
      name: "白葡萄酒"
    }, {
      name: "甜葡萄酒"
    }, {
      name: "起泡酒"
    }, {
      name: "百元畅饮"
    }, {
      name: "人气爆款"
    }, {
      name: "精品酒具"
    }, {
      name: "店主优选"
    }],
    currentNum: 0,
    blockListStyleLength: 4,
    markers: [{
      iconPath: "../../assets/images/address.png",
      id: 0,
      latitude: 31.107237,
      longitude: 104.392375,
      width: 30,
      height: 30
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
  },

  onLoad: function () {
    this.getData();
  },

  onShow() {
    let markers = this.data.markers;
    markers[0].width = 30;
    markers[0].height = 30;
    this.setData({
      markers
    })
  },

  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },

  getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: 31.107237, //要去的纬度-地址
          longitude: 104.392375, //要去的经度-地址
          name: "酒槑 18111501020",
          address: '四川省德阳市文杰莱茵广场1层3号'
        })
      }
    })
  },

  moveToLocation() {
    const _this = this;
    _this.mapCtx.moveToLocation({
      longitude: 104.392375,
      latitude: 31.107237,
      success: function () {
        let markers = _this.data.markers;
        markers[0].width = 30;
        markers[0].height = 30;
        _this.setData({
          markers
        })
      }
    });
  },

  markertap(e) {
    const index = e.markerId;
    let markers = this.data.markers;
    markers[index].width = 40;
    markers[index].height = 40;
    this.setData({
      markers
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: 31.107237, //要去的纬度-地址
          longitude: 104.392375, //要去的经度-地址
          name: "酒槑 18111501020",
          address: '四川省德阳市文杰莱茵广场1层3号'
        })
      }
    })
  },

  async getData() {
    const _this = this;
    const db = wx.cloud.database();
    let swiperList = await db.collection("banner").get({
      success: res => {
        console.log(res.data[0].bannerList)
        let data = res.data[0].bannerList;
        _this.setData({
          swiperList: data
        })
      },
      fail: err => {
        console.log("获取banner失败");
      }
    });
    // 醇臻推荐
    let one_product_list = await db.collection("goods").where({
      _activeIndex: "0"
    }).get({
      success: res => {
        console.log(res.data)
        let data = res.data;
        _this.setData({
          one_product_list: data
        })
      },
      fail: err => {
        console.log("获取banner失败");
      }
    });
    let two_product_list = await db.collection("goods").where({
      _activeIndex: "1"
    }).get({
      success: res => {
        console.log(res.data)
        let data = res.data;
        _this.setData({
          two_product_list: data
        })
      },
      fail: err => {
        console.log("获取banner失败");
      }
    });
    let three_product_list = await db.collection("goods").where({
      _activeIndex: "2"
    }).get({
      success: res => {
        console.log(res.data)
        let data = res.data;
        _this.setData({
          three_product_list: data
        })
      },
      fail: err => {
        console.log("获取banner失败");
      }
    });
  },

  jumpToProductList(e) {
    let title = e.currentTarget.dataset.title;
    let classid = e.currentTarget.dataset.classid;
    wx.navigateTo({
      url: '/pages/goodsClass/goodsClass?classid=' + classid + "&title=" + title,
    })
  },

  swiperChange(e) {
    let _this = this;
    if (_this.data.swiperList.length > _this.data.currentNum) {
      _this.data.currentNum = e.detail.current;
    } else if (_this.data.swiperList.length == _this.data.currentNum) {
      return;
    }
  },

  gotoBanner: function (e) {
    let goods_id = e.currentTarget.dataset.id;
    //banner跳转
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + goods_id
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})