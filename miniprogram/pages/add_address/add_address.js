Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioChecked: false,
    cityValue: [], //城市选择值
    citysLists: '',
    isShowCity: false,
    adds: undefined,
    name: undefined,
    phone: undefined,
    type: 1,
    id: '',
    cityCode: [],
    region: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    if (options.id) {
      let id = options.id;
      this.setData({
        _id: id
      });
      _this.getAddressDate(id);
    }
  },

  getAddressDate(_id) {
    const _this = this;
    const db = wx.cloud.database();
    db.collection("address-list").where({
      _id: _id
    }).get({
      success: res => {
        const address = res.data[0];
        _this.setData({
          adds: address.adds,
          cityValue: address.info,
          phone: address.mobile,
          name: address.realname,
          radioChecked: address.isdefault
        })
        console.log(address)
      },
      fail: err => {
        wx.showToast({
          title: '查无此地址',
        })
      }
    })
  },

  setParams(ev) {
    console.log(ev)
    const key = ev.target.dataset.key
    const value = ev.detail.value
    this.setData({
      [key]: value
    })
  },

  /**
   * 保存地址录入
   */
  save() {
    const _this = this;
    const db = wx.cloud.database();
    const {
      adds,
      name,
      phone,
      radioChecked,
      cityValue,
      _id
    } = this.data;
    wx.showLoading({
      title: _id ? '修改中' : '保存中',
    })
    console.log(adds, name, phone, radioChecked, cityValue)
    if (adds == undefined || adds == 'undefined' || adds == '' || adds == null) {
      wx.hideLoading();
      wx.showToast({
        title: '地址栏不能为空',
        icon: 'none'
      })
      return;
    }
    if (name == undefined || name == 'undefined' || name == '' || name == null) {
      wx.hideLoading();
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return;
    }
    if (phone == undefined || phone == 'undefined' || phone == '' || phone == null) {
      wx.hideLoading();
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.hideLoading();
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return;
    }
    if (cityValue.length <= 0) {
      wx.hideLoading();
      wx.showToast({
        title: '城市栏不能为空',
        icon: 'none'
      })
      return;
    }
    let addressData = {
      realname: name,
      mobile: phone,
      info: cityValue,
      adds: adds,
      isdefault: _this.data.radioChecked ? 1 : 0
    }
    if (_this.data.radioChecked) {
      // 将全部地址删除默认
      // 先设置将地址全部改为不是默认
      db.collection("address-list").where({
        _openid: wx.getStorageSync("PHONE_NUMBER")._openid,
      }).update({
        data: {
          isdefault: 0,
        },
        success: res => {
          if (_id) {
            db.collection("address-list").where({
              _id: _id,
            }).update({
              data: addressData,
              success: res => {
                wx.hideLoading();
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                })
                wx.navigateBack({
                  delta: 1
                })
              },
              fail: err => {
                wx.hideLoading();
              }
            });
          } else {
            _this.addNewAddress(addressData, function (res) {
              wx.navigateBack({
                delta: 1
              })
            }, function () {
              wx.hideLoading();
            })
          }

        },
        fail: err => {
          wx.hideLoading();
        }
      });
    } else {
      if (_id) {
        db.collection("address-list").where({
          _id: _id,
        }).update({
          data: addressData,
          success: res => {
            wx.hideLoading();
            wx.showToast({
              title: '修改成功',
              icon: 'success',
            })
            wx.navigateBack({
              delta: 1
            })
          },
          fail: err => {
            wx.hideLoading();
          }
        });
      } else {
        _this.addNewAddress(addressData, function (res) {
          wx.hideLoading();
          wx.navigateBack({
            delta: 1
          })
        }, function () {
          wx.hideLoading();
        })
      }
    }
  },

  // 修改默认地址
  getDefaultAddress: function (_id, fn, errFn) {
    wx.showLoading({});
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
  },

  addNewAddress: function (addressData, fn, errFn) {
    const that = this;
    const db = wx.cloud.database();
    db.collection("address-list").add({
      data: addressData,
      success: res => {
        console.log('添加新收货地址成功，返回的_id', res._id)
        if (res._id) {
          fn && fn(res)
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

  checkRadioFn() {
    let radioChecked = this.data.radioChecked;
    this.setData({
      radioChecked: !radioChecked
    })
    console.log(this.data.radioChecked)
  },
  /**
   * 点击选择城市
   */
  bindRegionChange: function (e) {
    this.cityName = e.detail.value[1];
    this.cityCode = e.detail.code[1];
    console.log("e.detail==>", e.detail);
    this.setData({
      cityValue: `${e.detail.value[0]} ${e.detail.value[1]} ${e.detail.value[2]}`
    })
  },
})