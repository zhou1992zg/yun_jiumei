Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgHeight: 0,
    userInfo: {},
    isLogin: wx.getStorageSync("USERINFO")
  },

  onShow: function (options) {
    if (!wx.getStorageSync("USERINFO")) {
      var pages = getCurrentPages(); //获取加载的页面
      var currentPage = pages[pages.length - 1]; //获取当前页面的对象
      var url = currentPage.route; //当前页面url
      console.log(url)
      wx.navigateTo({
        url: '../login/login' + "?url=" + url,
      })
    }
    let systemInfo = wx.getSystemInfoSync();
    this.setData({
      bgHeight: systemInfo.windowHeight
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              this.setData({
                userInfo: res.userInfo,
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
      })
    }
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