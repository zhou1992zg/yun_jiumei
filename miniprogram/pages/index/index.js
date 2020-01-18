//index.js
const app = getApp()

Page({
  data: {
    bannerList: [{ name: "红葡萄酒" }, { name: "白葡萄酒" }, { name: "甜葡萄酒" }, { name: "起泡酒" }, { name: "百元畅饮" }, { name: "人气爆款" }, { name: "精品酒具" }, { name: "店主优选" }],
    currentNum: 0,
    blockListStyleLength: 4,
    one_product_list: [{ pic: '../../static/banner_err.png' }, { pic: '../../static/banner_err.png' }, { pic: '../../static/banner_err.png' }],
    two_product_list: [{ pic: '../../static/banner_err.png' }, { pic: '../../static/banner_err.png' }, { pic: '../../static/banner_err.png' }],
    three_product_list: [{ pic: '../../static/banner_err.png' }, { pic: '../../static/banner_err.png' }, { pic: '../../static/banner_err.png' }],
    four_product_list: [{ pic: '../../static/banner_err.png' }]
  },

  onLoad: function () {
  },

  jumpToProductList(e){
    let title = e.currentTarget.dataset.title;
    let classid = e.currentTarget.dataset.classid;
    wx.navigateTo({
      url: '/pages/goodsClass/goodsClass?classid='+classid+"&title="+title,
    })
  },

  swiperChange(e) {
    let _this = this;
    if (_this.data.bannerList.length > _this.data.currentNum) {
      _this.data.currentNum = e.detail.current;
    } else if (_this.data.bannerList.length == _this.data.currentNum) {
      return;
    }
  },

  gotoBanner: function (isJump, isPosition, prId, catId, alt, outerUrl) {
    //banner跳转
    if (isJump == 1) {
      //是否跳转  1是 2否
      if (isPosition == 1) {
        //跳转位置：1商品详情 2外部跳转 3新增商品列表 4十万活动 5限时招募
        wx.navigateTo({
          url: "/pages/productDetails/main?productId=" + prId
        });
      } else if (isPosition == 2) {
        // wx.navigateTo({
        //   url: "/pages/activity/webPage/main?url=" + outerUrl
        // });
      } else if (isPosition == 3) {
        // wx.navigateTo({
        //   url: `/pages/goodsList/main?themeid=${catId}&title=${alt}`
        // });
      } else if (isPosition == 4) {
        wx.navigateTo({
          url: "/pages/activity/moneyIncentive/main"
        });
      } else if (isPosition == 5) {
        wx.navigateTo({
          url: "/pages/activity/cultivateTeam/main"
        });
      } else if (isPosition == 6) {
        wx.navigateTo({
          url: "/pages/activity/sendMoney/main"
        });
      }
    } else {
      console.log("不需要跳转！");
    }
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
