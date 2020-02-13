// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clicktag: 0,
    popUpWindowHidden: true,
    upUrl: '',
    showSkeleton: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    const _this = this;
    _this.getPageLu();
    const db = wx.cloud.database()
    db.collection("address-list").where({
      _openid: wx.getStorageSync("PHONE_NUMBER")._openid,
    }).get({
      success: res => {
        _this.setData({
          addressList: res.data,
          showSkeleton: false
        });
        _this.toFirstAddress(res.data);
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '获取地址失败',
        })
      }
    });
  },

  //获取上个页面路径
  getPageLu: function () {
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length - 2]; //获取当前页面的对象
    let url = currentPage.route; //当前页面url
    console.log(url)
    this.setData({
      upUrl: url
    })
  },

  useAddress: function (e) {
    let _this = this;
    const _id = e.currentTarget.dataset.id;
    let addressList = _this.data.addressList;
    addressList.forEach((element) => {
      if (element._id == _id) {
        wx.setStorageSync("ADDRESS_DATA", element);
        wx.navigateBack({
          delta: 1
        });
      }
    });
  },

  removeAddress: function (e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let isDefault = e.currentTarget.dataset.isdefault;
    if (isDefault) {
      wx.showToast({
        title: '默认地址不能删除',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认删除此收货地址?',
      success: function (res) {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection("address-list").where({
            _id: id
          }).remove({
            success: res => {
              wx.showToast({
                title: '删除成功',
              })
              _this.onShow() //删除成功重新加载
            },
            fail: err => {
              wx.showToast({
                title: '删除失败',
              })
            }
          })
        }
      }
    })
  },

  changeAddress: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/add_address/add_address?id=' + id,
    })
  },

  //将默认地址排在第一个
  toFirstAddress: function (addressList) {
    const _this = this;
    addressList.sort(function (a, b) {
      return b.isdefault - a.isdefault
    })
    console.log(addressList)
    _this.setData({
      addressList: addressList
    })
  },



  //修改默认地址
  changeDAddress: function (e) {
    let _this = this;
    const _id = e.currentTarget.dataset.id;
    let addressList = _this.data.addressList;
    let DAddress = {};
    addressList.forEach(function (element) {
      if (element._id == _id) {
        DAddress = element
      }
    });
    if (DAddress.isdefault == 1) {
      wx.showToast({
        title: '已经是默认地址咯',
        icon: 'none'
      })
      return
    } else {
      _this.delDefault(addressList[0]._id, function () {
        _this.addIsDefault(DAddress._id, function (addressList) {

          wx.showToast({
            title: '修改成功',
          });
          _this.onShow();
        }, function () {
          wx.showToast({
            title: '修改失败',
          })
        })
      }, function () {
        wx.showToast({
          title: '修改失败',
        })
      })
    }



    // _this.setData({
    //   addressList: addressList
    // })
  },

  delDefault: function (_id, fn, errFn) {
    const db = wx.cloud.database();
    db.collection("address-list").where({
      _id: _id
    }).update({
      data: {
        isdefault: 0,
      },
      success: res => {
        fn && fn()
      },
      fail: err => {
        errFn && errFn()
      }
    });
  },

  //添加默认地址
  addIsDefault: function (_id, fn, errFn) {
    wx.showLoading({
      title: '修改中'
    });
    const db = wx.cloud.database();
    // 先设置将地址全部改为不是默认
    db.collection("address-list").where({
      _openid: wx.getStorageSync("PHONE_NUMBER")._openid,
    }).update({
      data: {
        isdefault: 0,
      },
      success: res => {
        // 再将对应地址改为默认
        db.collection("address-list").where({
          _id: _id,
        }).update({
          data: {
            isdefault: 1,
          },
          success: res => {
            wx.hideLoading();
            fn && fn()
          },
          fail: err => {
            errFn && errFn()
          }
        });
      },
      fail: err => {
        errFn && errFn()
      }
    });
  }
})