// miniprogram/pages/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let that = this;
    console.log(option)
    that.option = option;
  },

  getPhoneNumber: function (e) {
    const that = this;
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        content: '不能获取手机号码',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '登陆中...',
    })
    wx.cloud.callFunction({
      name: 'getToken', // 对应云函数名
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionCode: wx.getStorageSync("SESSIONCODE") // 这个通过wx.login获取，去了解一下就知道。这不多描述
      },
      success: res => {
        // 成功拿到手机号
        let phoneNumber = res.result.data.phoneNumber;
        that.getUserInfo(phoneNumber, function (red) {
          console.log('用户信息==>', red)
          wx.setStorageSync("PHONE_NUMBER", red);
          wx.showToast({
            title: ' 登陆成功',
            icon: 'none'
          })
          wx.hideLoading()
          wx.reLaunch({
            url: '/' + that.option.url
          });
        }, function () {
          wx.hideLoading()
          wx.showToast({
            title: ' 登陆出现问题',
            icon: 'none'
          })
        })
      },
      fail: err => {
        console.error(err);
        wx.showToast({
          title: '获取手机号失败了',
          icon: 'none'
        })
      }
    })
  },

  // 获取用户信息
  getUserInfo: function (phoneNumber, fn, errFn) {
    const that = this;
    const db = wx.cloud.database()
    db.collection("user-info").where({
      _phoneNumber: phoneNumber
    }).get({
      success: res => {
        if (res.data.length == 0) {
          console.log('没有查询到对应手机号', res)
          that.addUserInfo(phoneNumber, function (red) {
            fn && fn(red)
          }, function () {
            errFn && errFn()
          })
        } else {
          fn && fn(res.data[0])
        }
      },
      fail: err => {
        console.log(err)
        errFn && errFn()
      }
    })
  },
  addUserInfo: function (phoneNumber, fn, errFn) {
    const that = this;
    const db = wx.cloud.database();
    db.collection("user-info").add({
      data: {
        _phoneNumber: phoneNumber,
      },
      success: res => {
        console.log('添加新用户信息成功后，返回的_id', res._id)
        if (res._id) {
          that.inquire(res._id, function (red) {
            fn && fn(red)
          }, function () {
            errFn && errFn()
          })
        } else {
          errFn && errFn()
        }
      },
      fail: err => {
        console.log(err)
        errFn && errFn()
      }
    })
  },

  // _id查询用户信息
  inquire: function (id, fn, errFn) {
    const db = wx.cloud.database();
    db.collection("user-info").where({
      _id: id
    }).get({
      success: res => {
        console.log('添加后查询', res.data[0])
        fn && fn(res.data[0])
      },
      fail: err => {
        errFn && errFn()
      }
    })
  },

  update: function (db, book) {
    db.collection("books").doc(book.id).update({
      data: {
        name: book.name,
        author: book.author,
        price: parseFloat(book.price)
      },
      success: res => {
        wx.showToast({
          title: '修改记录成功',
        })
        wx.navigateTo({
          url: '../index/index',
        })
      },
      fail: err => {
        wx.showToast({
          title: '修改失败',
        })
      }
    })
  },

  onGetOpenid: function () {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user userInfo: ', res.result.event.userInfo)
        wx.setStorageSync("USERINFO", res.result.event.userInfo);
        console.log(that.option.url)
        wx.reLaunch({
          url: '/' + that.option.url
        });
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  /**
   * 暂不登陆
   */
  noLoginFn: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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