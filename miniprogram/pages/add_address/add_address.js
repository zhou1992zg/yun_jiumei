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
    const {
      adds,
      name,
      phone,
      radioChecked,
      cityValue
    } = this.data
    console.log(adds, name, phone, radioChecked, cityValue)
    if (adds == undefined || adds == 'undefined' || adds == '' || adds == null) {
      wx.showToast({
        title: '地址栏不能为空',
        icon: 'none'
      })
      return;
    }
    if (name == undefined || name == 'undefined' || name == '' || name == null) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return;
    }
    if (phone == undefined || phone == 'undefined' || phone == '' || phone == null) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return;
    }
    if (cityValue.length <= 0) {
      wx.showToast({
        title: '城市栏不能为空',
        icon: 'none'
      })
      return;
    }
    let isdefault = 0;
    if (_this.data.radioChecked) {
      isdefault = 1
    }
    let addressData = {
      realname: name,
      mobile: phone,
      info: cityValue + adds,
      isdefault: isdefault
    }
    console.log(addressData)
    _this.addNewAddress(addressData, function (res) {
      wx.setStorageSync("ADDRESS_DATA", addressData);
      wx.navigateBack({
        delta: 1
      })
    }, function () {

    })
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