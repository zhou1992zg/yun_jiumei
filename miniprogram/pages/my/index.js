Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgHeight: 0,
    userInfo: {},
    isLogin: wx.getStorageSync("PHONE_NUMBER")
  },

  onShow: function (options) {
    let systemInfo = wx.getSystemInfoSync();
    let userInfo = {};
    if (!wx.getStorageSync("PHONE_NUMBER")) {
      var pages = getCurrentPages(); //获取加载的页面
      var currentPage = pages[pages.length - 1]; //获取当前页面的对象
      var url = currentPage.route; //当前页面url
      console.log(url)
      wx.navigateTo({
        url: '../login/login' + "?url=" + url,
      })
    }else{
      userInfo = wx.getStorageSync("PHONE_NUMBER");
    }
    this.setData({
      bgHeight: systemInfo.windowHeight,
      userInfo:userInfo
    })
  },

  onGetUserInfo: function (e) {
    const that = this;
    if (e.detail.userInfo) {
      that.update(e.detail.userInfo, wx.getStorageSync("PHONE_NUMBER"));
    }
  },

  // 更新用户信息
  update: function (userInfo, userPhone) {
    const db = wx.cloud.database();
    Object.assign(userPhone, userInfo);
    db.collection("user-info").where({
      _openid: userPhone._openid
    }).update({
      data: userInfo,
      success: res => {
        console.log(res)
        wx.setStorageSync("PHONE_NUMBER", userPhone)
        this.setData({
          userInfo: userPhone,
        })
        wx.showToast({
          title: '同步成功啦',
        })
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '同步失败啦，稍后再试',
        })
      }
    })
  },

  switchTabPage: function (e) {
    let listName = e.currentTarget.dataset.listname;
    wx.navigateTo({
      url: '/pages/shopOrder/shopOrder?listName=' + listName,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})